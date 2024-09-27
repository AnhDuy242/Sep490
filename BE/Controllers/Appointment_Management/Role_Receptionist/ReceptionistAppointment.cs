using AutoMapper;
using BE.DTOs.AppointmentDto;
using BE.Models;
using BE.Service;
using BE.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
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
        [HttpGet]
        public async Task<IActionResult> GetAllUnRegistedAppointment()
        {
            var appointments = _context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).Where(x=> x.Status.Equals("Đang chờ phê duyệt")).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            int count=list.Count();
            var jsonString = JsonSerializer.Serialize(list);
            Console.WriteLine(jsonString); // This will show the output in your console logs

            return Ok(count);
        }
        [HttpPut]
        public async Task<IActionResult> ApproveAppointment(int appId)
        {
            try
            {
                var appointment = _context.Appointments.FirstOrDefault(x => x.Id == appId);
                appointment.Status = "Đã phê duyệt";
                appointment.Check = 1;
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
                    ScheduleId=appointmentDto.ScheduleId,
                    ServiceId = appointmentDto.ServiceId,
                    Check=1
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
        [HttpGet("upcoming-appointments")]
        public async Task<IActionResult> GetUpcomingAppointments([FromQuery] DateTime currentTime)
        {
            var slots = await _context.Slots.ToListAsync();
            var schedules = await _context.Schedules
                .Where(s => s.Date.Date >= currentTime.Date)
                .OrderBy(s => s.Date)
                .ToListAsync();
            var filteredAppointments = new List<BE.Models.Appointment>();
            foreach (var schedule in schedules)
            {
                var scheduledDate = schedule.Date.Date;
                foreach (var slot in slots.OrderBy(s => s.Time))
                {
                    var timeParts = slot.Time.Split('-');
                    if (timeParts.Length != 2) continue;
                    if (TimeSpan.TryParse(timeParts[0], out TimeSpan slotStartTime))
                    {
                        DateTime fullSlotStartTime = scheduledDate.Add(slotStartTime);
                        if (currentTime <= fullSlotStartTime && fullSlotStartTime <= currentTime.AddMinutes(15))
                        {
                            var appointments = await _context.Appointments
                                .Include(a => a.Patient)
                                .Include(a => a.Doctor)
                                .Include(a => a.Slot)
                                .Include(a => a.Service)
                                .Where(a => a.SlotId == slot.SlotId &&
                                            a.Check == 1 &&
                                            a.ScheduleId == schedule.Id)
                                .ToListAsync();
                            filteredAppointments.AddRange(appointments);
                        }
                    }
                }
            }
            foreach (var appointment in filteredAppointments)
            {
                appointment.Check = 2;
            }
            await _context.SaveChangesAsync();

            if (filteredAppointments.Any())
            {
                var mappedAppointments = filteredAppointments.Select(appointment => new UpcomingAppointmentDetailDto
                {
                    AppointmentId = appointment.Id,
                    AppointmentDate = appointment.Date,
                    AppointmentStatus = appointment.Status,
                    AppointmentNote = appointment.Note,
                    PatientName = appointment.Patient?.Name,
                    PatientGender = appointment.Patient?.Gender,
                    PatientDob = appointment.Patient?.Dob ?? DateTime.MinValue,
                    DoctorName = appointment.Doctor?.Name,
                    DoctorGender = appointment.Doctor?.Gender,
                    DoctorAge = appointment.Doctor?.Age ?? 0,
                    DepartmentId = appointment.Doctor?.DepId ?? 0,
                    SlotTime = appointment.Slot?.Time,
                    ServiceId = appointment.ServiceId,
                    ScheduleId = appointment.ScheduleId
                }).ToList();

                return Ok(mappedAppointments);
            }

            return NotFound("No upcoming appointments found.");
        }
        [HttpGet("past-appointments")]
        public async Task<IActionResult> MarkPastAppointments([FromQuery] DateTime currentTime)
        {
            var slots = await _context.Slots.ToListAsync();
            var schedules = await _context.Schedules
                .Where(s => s.Date.Date <= currentTime.Date)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

            var filteredAppointments = new List<BE.Models.Appointment>();

            foreach (var schedule in schedules)
            {
                var scheduledDate = schedule.Date.Date;
                foreach (var slot in slots.OrderByDescending(s => s.Time))
                {
                    var timeParts = slot.Time.Split('-');
                    if (timeParts.Length != 2) continue;

                    if (TimeSpan.TryParse(timeParts[1], out TimeSpan slotEndTime))
                    {
                        DateTime fullSlotEndTime = scheduledDate.Add(slotEndTime);
                        if (fullSlotEndTime < currentTime)
                        {
                            var appointments = await _context.Appointments
                                .Include(a => a.Patient)
                                .Include(a => a.Doctor)
                                .Include(a => a.Slot)
                                .Include(a => a.Service)
                                .Where(a => a.SlotId == slot.SlotId &&
                                              (a.Check == 1 || a.Check == 2) &&
                                            a.ScheduleId == schedule.Id)
                                .ToListAsync();

                            filteredAppointments.AddRange(appointments);
                        }
                    }
                }
            }

            foreach (var appointment in filteredAppointments)
            {
                appointment.Check = 3;
            }

            await _context.SaveChangesAsync();
                return Ok(filteredAppointments);
            
           if (filteredAppointments.Any())  
            {
                var mappedAppointments = filteredAppointments.Select(appointment => new UpcomingAppointmentDetailDto
                {
                    AppointmentId = appointment.Id,
                    AppointmentDate = appointment.Date,
                    AppointmentStatus = appointment.Status,
                    AppointmentNote = appointment.Note,
                    PatientName = appointment.Patient?.Name,
                    PatientGender = appointment.Patient?.Gender,
                    PatientDob = appointment.Patient?.Dob ?? DateTime.MinValue,
                    DoctorName = appointment.Doctor?.Name,
                    DoctorGender = appointment.Doctor?.Gender,
                    DoctorAge = appointment.Doctor?.Age ?? 0,
                    DepartmentId = appointment.Doctor?.DepId ?? 0,
                    SlotTime = appointment.Slot?.Time,
                    ServiceId = appointment.ServiceId,
                    ScheduleId = appointment.ScheduleId
                }).ToList();

                return Ok(mappedAppointments);
            }

            return NotFound("Không tìm thấy cuộc hẹn nào cần cập nhật.");

        }
    }
}
