using BE.DTOs;
using BE.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Authentication
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public OtpController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-otp")]
        public async Task SendOtp(string usermail)
        {
            // Generate OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Save OTP to database or cache (not shown here)

            // Send OTP email


            var mailrequest  = new Mailrequest();
            mailrequest.Email = usermail;
            mailrequest.Subject = "Thanks for registering";
            mailrequest.Emailbody = $"Your OTP code is {otp}";
            await this._emailService.SendEmailAsync(mailrequest);
        }
    }

    public class OtpRequest
    {
        public string Email { get; set; }
    }
}
