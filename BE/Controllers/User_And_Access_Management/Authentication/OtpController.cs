using BE.DTOs;
using BE.Service;
using BE.Service.ImplService;
using BE.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Twilio.Types;

namespace BE.Controllers.User_And_Access_Management.Authentication
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class OtpController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ISMSService _smsService;
        private readonly OtpService _otpService;

        public OtpController(IEmailService emailService, ISMSService smsService, OtpService otpService)
        {
            _emailService = emailService;
            _smsService = smsService;
            _otpService = otpService;
        }

        //[HttpPost("email")]
        //public async Task SendOtpEmail(string usermail)
        //{
        //    // Generate OTP
        //    var otp = new Random().Next(100000, 999999).ToString();

        //    // Save OTP to database or cache (not shown here)

        //    // Send OTP email


        //    var mailrequest  = new Mailrequest();
        //    mailrequest.Email = usermail;
        //    mailrequest.Subject = "Thanks for registering";
        //    mailrequest.Emailbody = $"Your OTP code is {otp}";
        //    await this._emailService.SendEmailAsync(mailrequest);
        //}


        [HttpPost]
        public async Task<IActionResult> SendOtp(string Email)
        {
            if (string.IsNullOrEmpty(Email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                await _otpService.GenerateAndSendOtpAsync(Email);
                return Ok("OTP sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending OTP: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> ReceiveOtpEmail(string Email)
        {
            if (string.IsNullOrEmpty(Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            try
            {
                var otp = await _otpService.GenerateAndSendOtpAsync(Email);
                return Ok(new { message = "OTP sent successfully.", otp });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error sending OTP: {ex.Message}" });
            }
        }

        [HttpPost]
        public IActionResult VerifyOtpEmail([FromBody] OtpRequestEmail request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Otp))
            {
                return BadRequest("Email and OTP are required.");
            }

            var isValid = _otpService.VerifyOtp(request.Email, request.Otp);
            if (isValid)
            {
                return Ok("OTP verified successfully.");
            }
            else
            {
                return Unauthorized("Invalid OTP.");
            }
        }

        [HttpPost]
        public IActionResult VerifyOtpSMS([FromBody] OtpRequestSMS request)
        {
            // Get stored OTP using OtpService
            var storedOtp = _otpService.GetStoredOtp(request.PhoneNumber);

            if (storedOtp == request.Otp)
            {
                // Xác thực thành công, xóa OTP khỏi cache
                _otpService.RemoveOtp(request.PhoneNumber);
                return Ok(new { Status = "Verified" });
            }
            else
            {
                // OTP không hợp lệ
                return BadRequest(new { Status = "Invalid OTP" });
            }
        }
        [HttpPost]
        public async Task<IActionResult> SendOtpSms(string PhoneNumber)
        {
            if (string.IsNullOrEmpty(PhoneNumber))
            {
                return BadRequest("Phone number is required.");
            }

            var otp = new Random().Next(100000, 999999).ToString();
            _otpService.StoreOtp(PhoneNumber, otp);

            var message = $"Your OTP code is {otp}";

            try
            {
                await _smsService.SendSmsAsync(_smsService.ConvertPhoneNumberToInternationalFormat(PhoneNumber), message);
                return Ok("OTP sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending OTP: {ex.Message}");
            }
        }

       
    }

    public class OtpRequestSMS
    {
        public string PhoneNumber { get; set; }
        public string Otp { get; set; }
    }
    public class OtpRequestEmail
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }

}
