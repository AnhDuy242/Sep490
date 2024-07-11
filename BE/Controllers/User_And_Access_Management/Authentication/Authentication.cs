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
        private readonly Alo2Context _alo2Context;

        public Authentication(AuthService authService, Alo2Context alo2Context)
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
            if(CheckPhoneExist(registerDto.Phone) || CheckEmailExist(registerDto.Email))
            {
                return BadRequest();
            }
            else
            {
                Account account = new Account()
                {
                    Phone = registerDto.Phone,
                    Email = registerDto.Email,
                    Password = registerDto.Password,
                    RoleId = 3,
                    IsActive = true,
            };
               
                await _alo2Context.Accounts.AddAsync(account);
                await _alo2Context.SaveChangesAsync();
                Patient patient = new Patient()
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
                return Ok();
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
