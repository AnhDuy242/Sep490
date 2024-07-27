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

        public ReminderService(MedPalContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
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
                .Where(a => a.Status == "Tái khám" && a.Date.Date == DateTime.Today.AddDays(3).Date)
                .ToListAsync();

            foreach (var appointment in appointments)
            {
                // Fetch patient email using appointment.PatientId
                Mailrequest mailrequest = new Mailrequest()
                {
                    Email = GetPatientEmail(appointment.PatientId),
                    Subject = "Nhắc nhở lịch tái khám",
                    Emailbody = $"Bạn có một lịch tái khám vào ngày {appointment.Date.ToShortDateString()}."
                };
                _emailService.SendEmailAsync(mailrequest);
            }
        }

        private string GetPatientEmail(int patientId)
        {
            // Implement this method to fetch the patient's email from the database
            var p = _context.Accounts.FirstOrDefault(x => x.AccId == patientId);
            return p.Email;
        }
    }

}
