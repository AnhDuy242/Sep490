namespace BE.Service.ImplService
{
    using BE.DTOs;
    using BE.Models;
    using BE.Service.IService;
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Linq;

    public class ReminderService
    {
        private readonly MedPalContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ISMSService _sMSService;

        public ReminderService(MedPalContext context, IEmailService emailService, IConfiguration configuration, ISMSService sMSService)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
            _sMSService = sMSService;
        }
        public TimeSpan? GetNotificationTime()
        {
            var time = _configuration["NotificationTime:Time"];
            if (TimeSpan.TryParse(time, out TimeSpan parsedTime))
            {
                return parsedTime;
            }
            return null;
        }
        public async Task CheckAppointmentsAsync()
        {
            var appointments = await _context.Appointments
                .Include(x => x.Schedule)
                .Where(a => a.Status == "Tái khám" || a.Status == "Đã phê duyệt" && a.Schedule.Date <= DateTime.Today.AddDays(3).Date && a.Schedule.Date >= DateTime.Today.AddDays(1).Date)
                .ToListAsync();

            foreach (var appointment in appointments)
            {
                // Fetch patient email using appointment.PatientId

                Mailrequest mailrequest = new Mailrequest()
                {
                    Email = GetPatientEmail(appointment.PatientId),
                    Subject = "Nhắc nhở lịch khám",
                    Emailbody = $"Bạn có một lịch khám vào ngày {appointment.Schedule.Date.ToShortDateString()}."
                };
                _emailService.SendEmailAsync(mailrequest);

                string body = $"Bạn có một lịch khám vào ngày {appointment.Schedule.Date.ToShortDateString()}.";
                _sMSService.SendSmsAsync(GetPatientPhone(appointment.PatientId), body);

            }
        }

        private string GetPatientEmail(int patientId)
        {
            // Implement this method to fetch the patient's email from the database
            var p = _context.Accounts.FirstOrDefault(x => x.AccId == patientId);
            return p.Email;
        }

        private string GetPatientPhone(int patientId)
        {
            // Implement this method to fetch the patient's email from the database
            var p = _context.Accounts.FirstOrDefault(x => x.AccId == patientId);
            return _sMSService.ConvertPhoneNumberToInternationalFormat(p.Phone);
        }
    }

}
