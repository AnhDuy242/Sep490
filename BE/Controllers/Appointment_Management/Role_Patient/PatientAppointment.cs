using AutoMapper;
using BE.DTOs.AppointmentDto;
using BE.DTOs.DateDto;
using BE.DTOs.DepartmentDto;
using BE.DTOs.DoctorDto;
using BE.DTOs.ScheduleDto;
using BE.DTOs.ServiceDto;
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
            var appointments = _alo2Context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).Include(x => x.Service).ThenInclude(x => x.Dep).Where(x => x.PatientId == pid).ToList();
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
                ServiceId = appointmentDto.ServiceId,
            };
            if (appointment.DoctorId != null)
            {
                var s = _alo2Context.Schedules.Include(x => x.AppointmentsNavigation).Include(x => x.Doctor).Where(x => x.DoctorId == appointment.DoctorId).FirstOrDefault(x => x.Date == appointment.Date);
                appointment.ScheduleId = s.Id;
            }
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
            appointment.Status = "Đang chờ phê duyệt";
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
                return BadRequest(ex.Message);
            }

            return Ok("Appointment deleted successfully.");
        }

        [HttpGet]
        public async Task<IActionResult> GetListDoctor(int seId)
        {
            if (seId == null)
            {
                var listDoc = _alo2Context.Doctors.Where(x => x.IsActive == true).ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);
                return Ok(list);
            }
            else
            {
                var listDoc = _alo2Context.Doctors
             .Where(d => d.Services.Any(s => s.ServiceId == seId))
             .ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);

                return Ok(list);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetListService(int deId)
        {
            if (deId == null)
            {
                var listDoc = _alo2Context.Services.Where(x => x.IsActive == true).ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);
                return Ok(list);
            }
            else
            {
                var listDoc = _alo2Context.Services.Where(x => x.IsActive == true).Where(x => x.DepId == deId).ToList();
                var list = _mapper.Map<List<ServiceAppointment>>(listDoc);

                return Ok(list);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetListDepartment()
        {
            var listDe = _alo2Context.Departments.Where(x => x.IsActive == true).ToList();
            var list = _mapper.Map<List<DepartmentAppointment>>(listDe);
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> GetListSlot(int docid, [FromBody] DateTimeDto date)
        {
            var s = _alo2Context.Schedules.Include(x => x.Doctor).Where(x => x.DoctorId == docid).FirstOrDefault(x => x.Date == date.Date);
            if (s == null) return BadRequest();
            if (s.Morning == true && s.Afternoon == true)
            {
                var sl = _alo2Context.Slots.ToList();
                foreach(var slot in sl)
                {
                    var a = _alo2Context.Appointments.Where(x => x.ScheduleId == s.Id).Where(x => x.SlotId == slot.SlotId).ToList();
                    if(a.Count == 3) sl.Remove(slot);
                }
                return Ok(sl);
            }
            if (s.Morning == false && s.Afternoon == true)
            {
                var sl = _alo2Context.Slots.Where(x => x.Shift == 2).ToList();
                foreach (var slot in sl)
                {
                    var a = _alo2Context.Appointments.Where(x => x.ScheduleId == s.Id).Where(x => x.SlotId == slot.SlotId).ToList();
                    if (a.Count == 3) sl.Remove(slot);
                }
                return Ok(sl);
            }
            if (s.Morning == true && s.Afternoon == false)
            {
                var sl = _alo2Context.Slots.Where(x => x.Shift == 1).ToList();
                foreach (var slot in sl)
                {
                    var a = _alo2Context.Appointments.Where(x => x.ScheduleId == s.Id).Where(x => x.SlotId == slot.SlotId).ToList();
                    if (a.Count == 3) sl.Remove(slot);
                }
                return Ok(sl);
            }
            return BadRequest();
           
        }

        [HttpGet]
        public async Task<IActionResult> GetListDate(int docid)
        {
            var s = _alo2Context.Schedules.Include(x => x.Doctor).Where(x => x.DoctorId == docid).ToList();
            var d = _mapper.Map<List<DateAppointment>>(s);
            return Ok(d);
        }
        [HttpPut]
        public async Task<IActionResult> CancelAppointment(int aid)
        {
            Models.Appointment app = _alo2Context.Appointments.FirstOrDefault(x => x.Id == aid);
            if (app.Status == "Đang chờ phê duyệt")
            {
                _alo2Context.Appointments.Remove(app);
                await _alo2Context.SaveChangesAsync();
            }
            else if (app.Status == "Đã phê duyệt")
            {
                app.Status = "Đã hủy";
                await _alo2Context.SaveChangesAsync();
            }
            return Ok(app);
        }


    }
}
