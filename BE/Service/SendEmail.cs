using SendGrid.Helpers.Mail;
using SendGrid;

namespace BE.Service
{
    public class SendEmail
    {
        private readonly string _sendGridApiKey;

        public SendEmail(string sendGridApiKey)
        {
            _sendGridApiKey = sendGridApiKey;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var client = new SendGridClient(_sendGridApiKey);
            var from = new EmailAddress("anhndhe160131@fpt.edu.vn", "Your Name");
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);
            var response = await client.SendEmailAsync(msg);
        }
    }
}
