using BE.DTOs;
using BE.Models;
using BE.Service;
using BE.Service.ImplService;
using BE.Service.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE.Controllers.User_And_Access_Management.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreateEmployeeController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly ISMSService _smsService;
        private readonly IValidateService _validateService;
        public CreateEmployeeController(ISMSService smsService, MedPalContext context, IValidateService validateService)
        {
            _smsService = smsService;
            _context = context;
            _validateService = validateService;
        }
        // GET: api/<EmployeeController>

        // GET api/<EmployeeController>/5
        [HttpGet("{id}")]
        public string TestGet(int id)
        {
            return "value";
        }

        // POST api/<EmployeeController>
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!_validateService.CheckPhoneNumberExist(model.Phone))

            {
                return BadRequest(new { message = "Số điện thoại đã tồn tại" });
            }

            string password = _validateService.GenerateRandomPassword();
            string resetPasswordUrl = Url.Action("ResetPassword", "Account", null, Request.Scheme);



            if (model.Role == "Doctor")
            {
                Account account = new Account
                {
                    Phone = model.Phone,
                    Password = password,
                    RoleId = 2,
                    IsActive = true
                };
                await _context.Accounts.AddAsync(account);
                await _context.SaveChangesAsync();
                Doctor doctor = new Doctor
                {
                    DocId = account.AccId,
                    Name = model.Name,
                    Gender = model.Gender,
                    Age = model.Age,
                    DepId = 1,
                    IsActive = true
                };
                await _context.Doctors.AddAsync(doctor);
                // Lưu thông tin bác sĩ vào database
            }
            else if (model.Role == "Receptionist")
            {

                Account account = new Account
                {
                    Phone = model.Phone,
                    Password = password,
                    RoleId = 4,
                    IsActive = true
                };
                await _context.Accounts.AddAsync(account);
                await _context.SaveChangesAsync();
                Receptionist receptionist = new Receptionist
                {
                    RecepId = account.AccId,
                    Name = model.Name,
                    Gender = model.Gender,
                    Dob = model.Dob
                };
                await _context.Receptionists.AddAsync(receptionist);
                // Lưu thông tin nhân viên lễ tân vào database
            }

            await _context.SaveChangesAsync();


            // Gửi tin nhắn SMS cho nhân viên mới đăng ký
            await _smsService.SendSmsAsync(
                "+84" + model.Phone.Substring(1),
                $"Chào mừng {model.Name} đến với MedPal! Mật khẩu của bạn là: {password}. Vui lòng truy cập {resetPasswordUrl} để đổi mật khẩu.");

            //return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
            return CreatedAtAction(nameof(TestGet), new { id = model.Id }, model);
        }

        private string GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                                      .Select(s => s[random.Next(s.Length)])
                                      .ToArray());
        }

        private bool CheckPhoneNumberExist(string phoneNumber)
        {
            List<Account> accounts = _context.Accounts.ToList();
            foreach (var account in accounts)
            {
                if (account.Phone == phoneNumber)
                {
                    return false;
                }
            }
            return true;
        }


    }
}
