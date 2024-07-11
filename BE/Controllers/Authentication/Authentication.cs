using BE.DTOs;
using BE.Models;
using BE.Service;
using BE.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace BE.Controllers.Authentication
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class Authentication : ControllerBase
    {
        private readonly AuthService _authService;
<<<<<<< Updated upstream
        private readonly Alo2Context _alo2Context;

        public Authentication(AuthService authService, Alo2Context alo2Context)
=======
        private readonly IAccountService _accountService;
        private readonly Alo2Context _alo2Context;

        public Authentication(AuthService authService, IAccountService accountService, Alo2Context alo2Context)
>>>>>>> Stashed changes
        {
            _authService = authService;
            _alo2Context = alo2Context;
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


        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
<<<<<<< Updated upstream
            if(CheckPhoneExist(registerDto.Phone) || CheckEmailExist(registerDto.Email))
=======
            // Check if phone number or email already exists
            if (_accountService.CheckPhoneExist(registerDto.Phone))
>>>>>>> Stashed changes
            {
                return BadRequest(new { Message = "Số điện thoại đã tồn tại." });
            }

            else if (_accountService.CheckEmailExist(registerDto.Email))
            {
                return BadRequest(new { Message = "Email đã tồn tại." });
            }
            else
            {
                // Create a new Account entity

                var account = new Account
                {
                    Phone = registerDto.Phone,
                    Email = registerDto.Email,
                    Password = registerDto.Password,
                    RoleId = 3,
                    IsActive = true,
                };

                await _alo2Context.Accounts.AddAsync(account);
                await _alo2Context.SaveChangesAsync();

                var patient = new Patient
                {
                    IsActive = true,
                    Address = registerDto.Address,
                    Dob = registerDto.Dob,
                    Gender = registerDto.Gender,
                    Name = registerDto.Name,
                    PatientId = account.AccId,
                };

                await _alo2Context.Patients.AddAsync(patient);
                await _alo2Context.SaveChangesAsync();

                return Ok(new { message = "Đăng ký thành công" });
            }

        }

        private bool CheckEmailExist(string email)
        {
            var accounts = _alo2Context.Accounts.ToList();
            return accounts.Any(account => account.Email?.Equals(email, StringComparison.OrdinalIgnoreCase) == true);
        }

        private bool CheckPhoneExist(string phone)
        {
            var accounts = _alo2Context.Accounts.ToList();
            return accounts.Any(account => account.Phone.Equals(phone));

        }
    }
}
