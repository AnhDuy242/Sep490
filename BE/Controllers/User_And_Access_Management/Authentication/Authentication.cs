using BE.DTOs;
using BE.Models;
using BE.Service;
using BE.Service.IService;
using CloudinaryDotNet.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace BE.Controllers.User_And_Access_Management.Authentication
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class Authentication : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly MedPalContext _medPalContext;
        private readonly ISMSService _sMSService;

        public Authentication(AuthService authService, MedPalContext medPalContext, ISMSService sMSService)
        {
            _authService = authService;
            _medPalContext = medPalContext;
            _sMSService = sMSService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var token = await _authService.Authenticate(loginDto);

            if (token == null)
            {
                return Unauthorized();
            }

            return Ok(new { Token = token });
        }

        //[HttpPost]
        //public async Task<IActionResult> RegisterByPhone(string phone)
        //{


        //}
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto, string phone)
        {
            // Kiểm tra xem email đã tồn tại trong bảng Account chưa
            var existingAccount = await _medPalContext.Accounts
                .FirstOrDefaultAsync(a => a.Email == registerDto.Email);

            if (existingAccount != null)
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            // Kiểm tra xem số điện thoại đã tồn tại trong bảng Account chưa
         

            // Tạo mới Account
            var account = new Account
            {
                Email = registerDto.Email,
                Password = registerDto.Password,
                RoleId = 3,
                IsActive = true,
                Phone = phone
            };

            await _medPalContext.Accounts.AddAsync(account);
            await _medPalContext.SaveChangesAsync();

            // Tạo mới Patient
            var patient = new Patient
            {
                IsActive = true,
                Address = registerDto.Address,
                Dob = registerDto.Dob,
                Gender = registerDto.Gender,
                Name = registerDto.Name,
                PatientId = account.AccId
            };

            await _medPalContext.Patients.AddAsync(patient);
            await _medPalContext.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công" });
        }

        [HttpGet("check/{input}")]
        public async Task<IActionResult> Check(string input)
        {
            if (IsValidEmail(input))
            {
                var existingAccount = await _medPalContext.Accounts
                    .FirstOrDefaultAsync(a => a.Email == input);

                if (existingAccount != null)
                {
                    return Ok(new { type = "email", exists = true });
                }
                return Ok(new { type = "email", exists = false });
            }
            else if (IsValidPhoneNumber(input))
            {
                var existingAccount = await _medPalContext.Accounts
                    .FirstOrDefaultAsync(a => a.Phone == input);

                if (existingAccount != null)
                {
                    return Ok(new { type = "phone", exists = true });
                }
                return Ok(new { type = "phone", exists = false });
            }
            else
            {
                return BadRequest(new { message = "Định dạng không hợp lệ" });
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            // Giả sử rằng số điện thoại hợp lệ là chuỗi số và có độ dài từ 10 đến 15 ký tự
            return !string.IsNullOrEmpty(phoneNumber) && phoneNumber.All(char.IsDigit) && phoneNumber.Length >= 10 && phoneNumber.Length <= 15;
        }

        private bool CheckEmailExist(string email)
        {
            var accounts = _medPalContext.Accounts.ToList();
            return accounts.Any(account => account.Email?.Equals(email, StringComparison.OrdinalIgnoreCase) == true);
        }

        private bool CheckPhoneExist(string phone)
        {
            var accounts = _medPalContext.Accounts.ToList();
            return accounts.Any(account => account.Phone.Equals(phone));

        }
    }
}
