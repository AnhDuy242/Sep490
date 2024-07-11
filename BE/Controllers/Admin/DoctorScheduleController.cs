using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        [HttpGet]
        public async Task<IActionResult> GetSchedulesByWeekDate([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                // Tìm tuần có StartDate và EndDate nằm trong khoảng ngày được chỉ định
                var weeks = await _context.Weeks
                    .Where(w => w.StartDate >= startDate && w.EndDate <= endDate)
                    .FirstOrDefaultAsync();

                if (weeks == null)
                {
                    return NotFound("No weeks found in the specified date range.");
                }


                // Truy vấn để lấy các schedule có WeekId trong các tuần tìm được
                var schedules = await _context.Schedules
                    .Include(s => s.Doctor)
                    .Include(s => s.Week)
                    .Where(s => weeks.WeekId == s.WeekId)
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
        [HttpGet("{id}")]
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
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ScheduleCreationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] ScheduleCreationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingSchedule = await _context.Schedules.FindAsync(id);

                if (existingSchedule == null)
                {
                    return NotFound();
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var schedule = await _context.Schedules.FindAsync(id);
                if (schedule == null)
                {
                    return NotFound();
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

    }
}
