using AutoMapper;
using BE.DTOs;
using BE.DTOs.AppointmentDto;
using BE.DTOs.PatientDto;
using BE.Models;
using BE.Service;
using BE.Service.IService;
using Emgu.CV.Ocl;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Appointment_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdminAppointment : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        private readonly ISMSService _sMSService;
        private readonly IEmailService _emailService;
        public AdminAppointment(MedPalContext context, IMapper mapper, ISMSService sMSService, IEmailService emailService)
        {
            _context = context;
            _mapper = mapper;
            _sMSService = sMSService;
            _emailService = emailService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAppointment()
        {
            var appointments = _context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            return Ok(list);
        }
        [HttpGet]
        public async Task<IActionResult> GetAppointmentsForDoctor(int doctorId, DateTime startDate, DateTime endDate)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.Date >= startDate && a.Date <= endDate)
                .Select(a => new { a.Id, a.Date, a.SlotId })
                .ToListAsync();

            return Ok(appointments);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateAppointmentsStatus([FromBody] UpdateAppointmentsRequest request)
        {
            // Validate the request
            if (request.ScheduleId <= 0 || request.SlotId <= 0 || request.DoctorId <= 0)
            {
            }

            // Fetch the appointments based on ScheduleId, SlotId, and DoctorId
            var appointments = await _context.Appointments
                .Where(a => a.ScheduleId == request.ScheduleId
                             && a.SlotId == request.SlotId
                             && a.DoctorId == request.DoctorId) // Thêm điều kiện DoctorId
                .ToListAsync();

            if (!appointments.Any())
            {
            }

            // Update the status of the appointments to "Đã hủy"
            foreach (var appointment in appointments)
            {
                appointment.Status = "Đã hủy"; // Set status to "Đã hủy"
                appointment.Note = "Bác sĩ đã báo nghỉ";
                _context.Appointments.Update(appointment);
                var phone = _context.Patients
                        .Where(p => p.PatientId == appointment.PatientId)
                        .Select(p => p.PatientNavigation.Phone)
                        .FirstOrDefault();
                _sMSService.SendSmsAsync(_sMSService.ConvertPhoneNumberToInternationalFormat(phone), "Lịch khám đã đươc thay đổi, vui lòng truy cập trang web để xem lại thông tin!");
                var email = _context.Patients
                        .Where(p => p.PatientId == appointment.PatientId)
                        .Select(p => p.PatientNavigation.Email)
                        .FirstOrDefault();
                if (email != null)
                {
                    _emailService.SendEmailAsync(new Mailrequest { Email = email, Emailbody = "Lịch khám đã đươc thay đổi, vui lòng truy cập trang web để xem lại thông tin!", Subject = "Thông báo về việc thay đổi lịch khám" });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Đã có lỗi xảy ra.");
            }


            return Ok(new { Message = "Cập nhật thành công!" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments(DateTime date)
        {
            var appointments = await _context.Appointments
                .Where(a => a.Date.Date == date.Date)
                .OrderBy(a => a.SlotId)
                .Select(a => new AppointmentDetailDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    DoctorId = (int)a.DoctorId,
                    Date = a.Date,
                    Status = a.Status,
                    SlotId = a.SlotId,
                    Note = a.Note
                })
                .ToListAsync();

            if (!appointments.Any())
            {
                return NotFound("No appointments found for the specified date.");
            }

            return Ok(appointments);
        }

        [HttpGet("by-doctor")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointmentsByDoctor(int doctorId, DateTime date)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.Date.Date == date.Date)
                .OrderBy(a => a.SlotId)
                .Select(a => new AppointmentDto
                {
                    PatientId = a.PatientId,
                    DoctorId = (int)a.DoctorId,
                    Date = a.Date,
                    Status = a.Status,
                    SlotId = a.SlotId,
                    Note = a.Note,
                    DoctorName = a.Doctor.Name, 
                    time = a.Slot.Time, 
                    PatientName = a.Patient.Name 
                })
                .ToListAsync();

            if (!appointments.Any())
            {
                return NotFound("Không tìm thấy lịch hẹn nào.");
            }
            return Ok(appointments);
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }
        private bool ScheduleExists(int id)
        {
            return _context.Schedules.Any(e => e.Id == id);
        }
    }
}
