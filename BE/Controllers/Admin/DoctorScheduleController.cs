using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NuGet.Protocol;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorScheduleController : ControllerBase
    {
        private readonly Alo2Context _context;

        
        public DoctorScheduleController(Alo2Context context)
        {
            _context = context;
        }

        // GET: api/<DoctorScheduleController>
        [HttpGet("GetAllSchedulesByDoctorId")]
        public async Task<IActionResult> GetAllSchedulesByDoctorId([FromQuery] int? doctorId = null)
        {
            try
            {
                


                // Truy vấn để lấy các schedule có WeekId trong các tuần tìm được
                var schedules = await _context.Schedules
                    .Include(s => s.Doctor)
                    .Where(s => (doctorId.HasValue ? s.DoctorId == doctorId.Value : true))
                    .Select(s => new
                    {
                        Id = s.Id,
                        DoctorName = s.Doctor.Name,
                        Morning = s.Morning,
                        Afternoon = s.Afternoon,
                        Weekdays = s.Weekdays,
                        Date = s.Date,
                        Appointments = s.Appointments
                    }
                    )
                    .ToListAsync();



                return Ok(schedules);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        // GET api/<DoctorScheduleController>/5
        [HttpGet("GetScheduleById/{id}")]
        public async Task<IActionResult> GetScheduleById(int id)
        {
            try
            {
                // Tìm schedule theo id
                var schedule = await _context.Schedules
                    .Include(s => s.Doctor)
                    .Include(s => s.Week)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (schedule == null)
                {
                    return NotFound(new { message = "Schedule not found" });
                }

                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // POST api/<DoctorScheduleController>
        [HttpPost("CreateSchedule")]
        public async Task<IActionResult> CreateSchedule([FromBody] ScheduleCreationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var schedules = _context.Schedules.ToList();
            foreach(var s in schedules)
            {
                if(model.Date == s.Date)
                {
                    return BadRequest(new {message = "Schedule da ton tai" });
                }
            }
            try
            {
                var schedule = new Schedule
                {
                    DoctorId = model.DoctorId,
                    Morning = model.Morning,
                    Afternoon = model.Afternoon,
                    Weekdays = model.Weekdays,
                    Date = model.Date,
                    WeekId = model.WeekId,
                    Appointments = model.Appointments
                };

                await _context.Schedules.AddAsync(schedule);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetScheduleById), new { id = schedule.Id }, schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // PUT api/<DoctorScheduleController>/5
        [HttpPut("UpdateSchedule/{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] ScheduleCreationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var schedules = _context.Schedules.ToList();
            try
            {
                var existingSchedule = await _context.Schedules.FindAsync(id);

                if (existingSchedule == null)
                {
                    return NotFound();
                }
                TimeSpan date = existingSchedule.Date - DateTime.Now;
                foreach (var s in schedules)
                {
                    if (date.TotalDays > 30)
                    {
                        return BadRequest(new { message = "Schedule date da qua han update, vui long thu lai" });
                    }
                }

                // Cập nhật các thuộc tính của existingSchedule từ model
                existingSchedule.DoctorId = model.DoctorId;
                existingSchedule.Morning = model.Morning;
                existingSchedule.Afternoon = model.Afternoon;
                existingSchedule.Weekdays = model.Weekdays;
                existingSchedule.Date = model.Date;
                existingSchedule.WeekId = model.WeekId;
                existingSchedule.Appointments = model.Appointments;

                _context.Schedules.Update(existingSchedule);
                await _context.SaveChangesAsync();

                return Ok(existingSchedule);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        // DELETE api/<DoctorScheduleController>/5
        [HttpDelete("DeleteSchedule/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var schedule = await _context.Schedules.FindAsync(id);
                if (schedule == null)
                {
                    return NotFound();
                }
                var schedules = getListSchedule(schedule.DoctorId);
                if (!schedules.Any())
                {
                    _context.Schedules.Remove(schedule);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Schedule deleted successfully" });
                }
                else
                {
                    foreach(var s in schedules)
                    {
                       
                    }
                }
                _context.Schedules.Remove(schedule);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Schedule deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        private List<object> getListSchedule(int doctorId)
        {
            var schedules = _context.Schedules
                .Join(
                _context.Appointments,
                schedule => schedule.DoctorId,
                appointment => appointment.DoctorId,
                (schedule, appointment) => new { schedule, appointment}
                )
                .Where(s => s.schedule.DoctorId == doctorId)
                .ToList<object>();

            return schedules;
        }

    }
}
