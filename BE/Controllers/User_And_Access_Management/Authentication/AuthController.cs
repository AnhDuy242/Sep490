using BE.Models;
using BE.Service;
using BE.Service.IService;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties { RedirectUri = Url.Action("GoogleResponse") };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("signin-google")]
        public async Task<IActionResult> GoogleResponse2()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded)
                return BadRequest();

            // Lấy thông tin người dùng từ Claims
            var claims = result.Principal.Identities.FirstOrDefault().Claims;
            var userInfo = new
            {
                Name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
            };

            // Tạo logic lưu trữ người dùng vào DB nếu cần

            return Ok(userInfo);
        }

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!result.Succeeded)
                return BadRequest("Xác thực Google thất bại.");

            var claims = result.Principal.Identities.FirstOrDefault().Claims;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var googleId = claims.FirstOrDefault(c => c.Type == "sub")?.Value; // Google ID từ claim "sub"
            var accessToken = result.Properties.GetTokenValue("access_token");

            if (email == null || googleId == null)
                return BadRequest("Không tìm thấy thông tin email hoặc Google ID.");

            // Kiểm tra người dùng đã tồn tại trong hệ thống chưa
            var user = await _userService.GetUserByGoogleIdAsync(googleId);
            if (user == null)
            {
                // Đăng ký người dùng mới nếu chưa tồn tại
                user = await _userService.RegisterUserAsync(email, googleId, result.Principal.Identity.Name, accessToken);
            }

            // Cập nhật lần đăng nhập cuối cùng
            await _userService.UpdateLastLoginAsync(user);

            // Tạo JWT token cho người dùng
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
                User = new
                {
                    user.AccId,
                    user.Email,
                    user.IsActive,
                    user.RoleId
                }
            });
        }

        private string GenerateJwtToken(Account user)
        {
            // Logic tạo JWT token, tương tự như phần trước
            return "your-generated-jwt-token";
        }
    }
}
