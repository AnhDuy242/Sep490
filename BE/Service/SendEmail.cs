using SendGrid.Helpers.Mail;
using SendGrid;
using System.Net.Mail;
using System.Net;

namespace BE.Service
{
    public class SendEmail
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;

        public SendEmail(string smtpServer, int smtpPort, string smtpUser, string smtpPass)
        {
            _smtpServer = smtpServer;
            _smtpPort = smtpPort;
            _smtpUser = smtpUser;
            _smtpPass = smtpPass;
        }

        public  Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var mail = "uchihad.saitama@gmail.com";
            var pw = "denhokhongdau123@@";

            var client = new SmtpClient("smtp.gmail.com", 587)
            {
               
                EnableSsl = true,
                Credentials = new NetworkCredential(mail, pw)
            };
            client.UseDefaultCredentials = false;
            return client.SendMailAsync(
                new MailMessage(from:mail, to:toEmail, subject, body));
        }
    }
}
