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
        private readonly ISMSService _smsService;

        public OtpController(IEmailService emailService, ISMSService smsService)
        {
            _emailService = emailService;
            _smsService = smsService;
        }

        [HttpPost("email")]
        public async Task SendOtpEmail(string usermail)
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

        [HttpPost("sms")]
        public async Task<IActionResult> SendOtpSms(string PhoneNumber)
        {
            if (string.IsNullOrEmpty(PhoneNumber))
            {
                return BadRequest("Phone number is required.");
            }

            var otp = new Random().Next(100000, 999999).ToString();
            var message = $"Your OTP code is {otp}";

            try
            {
                await _smsService.SendSmsAsync(PhoneNumber, message);
                return Ok("OTP sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending OTP: {ex.Message}");
            }
        }

       
    }

   
    
}
