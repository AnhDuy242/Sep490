using AutoMapper;
using BE.DTOs.AppointmentDto;
using BE.DTOs.DepartmentDto;
using BE.DTOs.DoctorDto;
using BE.DTOs.SlotDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace BE.Controllers.Appointment_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PatientAppointment : ControllerBase
    {
        private readonly MedPalContext _alo2Context;
        private readonly IMapper _mapper;

        public PatientAppointment(MedPalContext alo2Context, IMapper mapper)
        {
            _alo2Context = alo2Context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointment(int pid)
        {
            var appointments = _alo2Context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).Where(x => x.PatientId == pid).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentCreate appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Models.Appointment appointment = new Models.Appointment()
            {
                Date = appointmentDto.Date.Date,
                PatientId = appointmentDto.PatientId,
                DoctorId = appointmentDto.DoctorId,
                SlotId = appointmentDto.SlotId,
                Status = "Đang chờ phê duyệt",
            };
            _alo2Context.Appointments.Add(appointment);
            _alo2Context.SaveChanges();
            return Ok(appointment);
        }


        [HttpPost]
        public async Task<IActionResult> UpdateAppointment(int appId, [FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var appointment = await _alo2Context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Include(a => a.Slot)
                .FirstOrDefaultAsync(a => a.Id == appId);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            // Update appointment properties
            appointment.PatientId = appointmentDto.PatientId;
            appointment.DoctorId = appointmentDto.DoctorId;
            appointment.Date = appointmentDto.Date;
            appointment.SlotId = appointmentDto.SlotId;
            appointment.Note = appointmentDto.Note;

            try
            {
                await _alo2Context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(appId))
                {
                    return NotFound("Appointment not found.");
                }
                else
                {
                    throw;
                }
            }

            return Ok(appointment);
        }
        private bool AppointmentExists(int id)
        {
            return _alo2Context.Appointments.Any(e => e.Id == id);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAppointment(int appId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var appointment = await _alo2Context.Appointments.FindAsync(appId);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            _alo2Context.Appointments.Remove(appointment);

            try
            {
                await _alo2Context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Appointment deleted successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetListDoctor(int deId)
        {
            if (deId == null)
            {
                var listDoc = _alo2Context.Doctors.Where(x => x.IsActive == true).ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);
                return Ok(list);
            }
            else
            {
                var listDoc = _alo2Context.Doctors.Where(x => x.IsActive == true).Where(x => x.DepId == deId).ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);

                return Ok(list);
            }
        }

        [HttpPut]
        public async Task<IActionResult> CancelAppointment(int aid)
        {
            Models.Appointment app = _alo2Context.Appointments.FirstOrDefault(x => x.Id == aid);   
            if(app.Status == "Đang chờ phê duyệt")
            {
                _alo2Context.Appointments.Remove(app);
                await _alo2Context.SaveChangesAsync();
            }
            else if(app.Status == "Đã phê duyệt")
            {
                app.Status = "Đã hủy";
                await _alo2Context.SaveChangesAsync();
            }
            return Ok(app);
        }

        [HttpGet]
        public async Task<IActionResult> GetListDepartment()
        {
            var listDe = _alo2Context.Departments.Where(x => x.IsActive == true).ToList();
            var list = _mapper.Map<List<DepartmentAppointment>>(listDe);
            return Ok(list);
        }

        [HttpGet]
        public async Task<IActionResult> GetListSlot()
        {
            var listDe = _alo2Context.Slots.ToList();
            var list = _mapper.Map<List<SlotAppointment>>(listDe);
            return Ok(list);
        }
    }
}
