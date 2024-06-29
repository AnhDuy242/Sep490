using BE.Service;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Authentication
{
    [Route("api/[controller]")]
    [ApiController]
    public class OtpController : ControllerBase
    {
        private readonly SendEmail _emailService;

        public OtpController(SendEmail emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendOtp([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            // Tạo mã OTP
            var otp = new Random().Next(100000, 999999).ToString();

            // Gửi OTP qua email
            var subject = "Your OTP Code";
            var body = $"Your OTP code is: {otp}";

            try
            {
                await _emailService.SendEmailAsync(email, subject, body);
                return Ok("OTP sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("smtp")]
        public async Task<IActionResult> Index([FromBody] string email)
        {
            var sub = "alo";
            var message = "hello";
            await _emailService.SendEmailAsync(email, sub, message);
            return Ok("succesfull");
        }
    }
}
