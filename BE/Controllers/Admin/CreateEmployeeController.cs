using BE.Models;
using BE.Models.DTOs;
using BE.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreateEmployeeController : ControllerBase
    {
        private readonly Alo2Context _context;
        private readonly ISMSService _smsService;
        public CreateEmployeeController(ISMSService smsService, Alo2Context context) {
            _smsService = smsService;
            _context = context;
        }
        // GET: api/<EmployeeController>
        [HttpGet]
        

        // GET api/<EmployeeController>/5
        [HttpGet("{id}")]
        public string Get(int id)
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
                if (!CheckPhoneNumberExist(model.Phone))
                {
                    return BadRequest(new { message = "Số điện thoại đã tồn tại" });
                }

            string password = GenerateRandomPassword();
                string resetPasswordUrl = Url.Action("ResetPassword", "Account", null, Request.Scheme);

            

                if (model.Role == "Doctor")
                {
                    Doctor doctor = new Doctor
                    {
                        Name = model.Name,
                        Gender = model.Gender,
                        Phone = model.Phone,
                        Age = model.Age,
                        DepartmentId = 1
                    };

                    Account account = new Account
                    {
                        Phone = model.Phone,
                        Password = password,
                        RoleId = 2
                    };
                await _context.Accounts.AddAsync(account);
                await _context.Doctors.AddAsync(doctor);
                    // Lưu thông tin bác sĩ vào database
                }
                else if (model.Role == "Receptionist")
                {
                    Receptionist receptionist = new Receptionist
                    {
                        Name = model.Name,
                        Gender = model.Gender,
                        Phone = model.Phone,
                        Age = model.Age
                    };
                    Account account = new Account
                    {
                        Phone = model.Phone,
                        Password = password,
                        RoleId = 4
                    };
                await _context.Accounts.AddAsync(account);
                await _context.Receptionists.AddAsync(receptionist);
                    // Lưu thông tin nhân viên lễ tân vào database
                }

            
                await _context.SaveChangesAsync();

                // Gửi tin nhắn SMS cho nhân viên mới đăng ký
                await _smsService.SendSmsAsync(
                    "+84" + model.Phone.Substring(1),
                    $"Chào mừng {model.Name} đến với MedPal! Mật khẩu của bạn là: {password}. Vui lòng truy cập {resetPasswordUrl} để đổi mật khẩu.");

                //return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
                return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
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
                if(account.Phone == phoneNumber)
                {
                    return false;
                }
            }
            return true;
        }
        // PUT api/<EmployeeController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<EmployeeController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
