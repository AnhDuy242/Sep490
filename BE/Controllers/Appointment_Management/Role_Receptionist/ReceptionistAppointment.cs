using AutoMapper;
using BE.DTOs.AppointmentDto;
using BE.Models;
using BE.Service;
using BE.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text.Json;

namespace BE.Controllers.Appointment
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistAppointment : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        private readonly ISMSService _service;
        private readonly IEmailService _emailService;
        public ReceptionistAppointment(MedPalContext context, IMapper mapper, ISMSService sMSService, IEmailService emailService)
        { _context = context; _mapper = mapper; _service = sMSService; _emailService = emailService; }

        [HttpGet]
        public async Task<IActionResult> GetAllAppointment()
        {
            var appointments = _context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            var jsonString = JsonSerializer.Serialize(list);
            Console.WriteLine(jsonString); // This will show the output in your console logs

            return Ok(list);
        }
        [HttpPut]
        public async Task<IActionResult> ApproveAppointment(int appId)
        {
            try
            {
                var appointment = _context.Appointments.FirstOrDefault(x => x.Id == appId);
                appointment.Status = "Đã phê duyệt";
                await _context.SaveChangesAsync();
                var phone = _context.Patients
                            .Where(p => p.PatientId == appointment.PatientId)
                            .Select(p => p.PatientNavigation.Phone)
                            .FirstOrDefault();
                _service.SendSmsAsync(_service.ConvertPhoneNumberToInternationalFormat(phone), "Lịch khám đã đươc phê duyệt, vui lòng truy cập trang web để xem lại thông tin!");
                var email = _context.Patients
                            .Where(p => p.PatientId == appointment.PatientId)
                            .Select(p => p.PatientNavigation.Email)
                            .FirstOrDefault();
                _emailService.SendEmailAsync(new DTOs.Mailrequest { Email = email, Emailbody = "Lịch khám đã đươc phê duyệt, vui lòng truy cập trang web để xem lại thông tin!", Subject = "Thông báo thay đổi lịch khám" });
                return Ok("Appointment approved successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpDelete]
        public async Task<IActionResult> CancelAppointment(int appId)
        {
            var appointment = _context.Appointments.FirstOrDefault(x => x.Id == appId);
            _context.Appointments.Remove(appointment);
            return Ok("Appointment cancel successfully.");
        }
        [HttpDelete]
        public async Task<IActionResult> DeclineAppointment(int appId)
        {
            try
            {
                var appointment = _context.Appointments.FirstOrDefault(x => x.Id == appId);
                appointment.Status = "Không đặt được lịch hẹn";
                await _context.SaveChangesAsync();
                var phone = _context.Patients
                           .Where(p => p.PatientId == appointment.PatientId)
                           .Select(p => p.PatientNavigation.Phone)
                           .FirstOrDefault();
                _service.SendSmsAsync(_service.ConvertPhoneNumberToInternationalFormat(phone), "Lịch khám đã đươc thay đổi, vui lòng truy cập trang web để xem lại thông tin!");
                var email = _context.Patients
                            .Where(p => p.PatientId == appointment.PatientId)
                            .Select(p => p.PatientNavigation.Email)
                            .FirstOrDefault();
                if (email != null)
                    _emailService.SendEmailAsync(new DTOs.Mailrequest { Email = email, Emailbody = "Lịch khám đã đươc thay đổi, vui lòng truy cập trang web để xem lại thông tin!", Subject = "Thông báo thay đổi lịch khám" });

                return Ok("Appointment cancel successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentCreate appointmentDto)
        {
            try
            {
                Models.Appointment appointment = new Models.Appointment()
                {
                    Date = appointmentDto.Date,
                    PatientId = appointmentDto.PatientId,
                    DoctorId = appointmentDto.DoctorId,
                    SlotId = appointmentDto.SlotId,
                    Status = "Tái khám",
                    ServiceId = appointmentDto.ServiceId,
                };
                _context.Appointments.Add(appointment);
                _context.SaveChanges();
                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
