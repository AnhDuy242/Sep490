using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE.Controllers.Admin
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ManageScheduleController : ControllerBase
    {
        private readonly MedPalContext _context;

        public ManageScheduleController(MedPalContext context)
        {
            _context = context;
        }

        // GET: api/<DoctorScheduleController>
        [HttpGet]

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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetScheduleById(int id)
        {
            try
            {
                // Tìm schedule theo id
                var schedule = await _context.Schedules
                    .Include(s => s.Doctor)
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
        public async Task<IActionResult> CreateSchedule([FromBody] ScheduleCreationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingSchedule = _context.Schedules.ToList();
                var schedules = new List<Schedule>();
                DateTime currentDate = model.StartDate;

                var listDateDuplicate = "";
                while (currentDate <= model.EndDate)
                {
                    int dayOfWeek = (int)currentDate.DayOfWeek; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                    var schedule = new Schedule
                    {
                        DoctorId = model.DoctorId,
                        Morning = model.Morning[dayOfWeek],
                        Afternoon = model.Afternoon[dayOfWeek],
                        Weekdays = currentDate.DayOfWeek.ToString(),
                        Date = currentDate,
                        Appointments = 0
                    };

                    bool shouldContinue = false;
                    foreach (var s in existingSchedule)
                    {
                        if (s.DoctorId == schedule.DoctorId && s.Date == schedule.Date)
                        {
                            shouldContinue = true;
                            listDateDuplicate += $"{s.Date},\n  ";
                            break;
                        }
                    }

                    if (shouldContinue)
                    {
                        currentDate = currentDate.AddDays(1);
                        continue;
                    }

                    schedules.Add(schedule);
                    currentDate = currentDate.AddDays(1);
                }

                await _context.Schedules.AddRangeAsync(schedules);
                await _context.SaveChangesAsync();


                if (!string.IsNullOrWhiteSpace(listDateDuplicate))
                {
                    return StatusCode(StatusCodes.Status302Found, $"Đã thêm mới các ngày khác thành công trừ những ngày dưới đây không được thêm vào do đã tồn tại: {listDateDuplicate}");
                }

                return CreatedAtAction(nameof(GetAllSchedulesByDoctorId), new { doctorId = model.DoctorId }, schedules);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        // PUT api/<DoctorScheduleController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] ScheduleUpdateModel model)
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
                var schedules = getListSchedule(schedule.DoctorId);
                if (!schedules.Any())
                {
                    _context.Schedules.Remove(schedule);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Schedule deleted successfully" });
                }
                else
                {
                    foreach (var s in schedules)
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
                (schedule, appointment) => new { schedule, appointment }
                )
                .Where(s => s.schedule.DoctorId == doctorId)
                .ToList<object>();

            return schedules;
        }
    }
}
