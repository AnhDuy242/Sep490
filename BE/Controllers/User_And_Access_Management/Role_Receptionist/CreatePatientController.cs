using BE.DTOs;
using BE.Models;
using BE.Service;
using BE.Service.ImplService;
using BE.Service.IService;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE.Controllers.User_And_Access_Management.Role_Receptionist
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CreatePatientController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly ISMSService _smsService;
        private readonly IValidateService _validateService;

        public CreatePatientController(MedPalContext context, ISMSService service, IValidateService validateService)
        {
            _context = context;
            _smsService = service;
            _validateService = validateService;
        }


        // GET api/<CreatePatientController>/5
        [HttpGet("{id}")]
        public string TestGet(int id)
        {
            return "value";
        }

        // POST api/<CreatePatientController>
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(PatientCreationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!_validateService.CheckPhoneNumberExist(model.Phone))

            {
                return BadRequest(new { message = "Số điện thoại đã tồn tại" });
            }

         

                Account account = new Account
                {
                    Phone = model.Phone,
                    Password = model.Password,
                    RoleId = 3,
                    IsActive = true
                };
                await _context.Accounts.AddAsync(account);
                await _context.SaveChangesAsync();
                Patient patient = new Patient
                {
                    PatientId = account.AccId,
                    Name = model.Name,
                    Gender = model.Gender,
                    Dob = model.Dob,
                    Address = model.Address,
                    IsActive = true
                };
                await _context.Patients.AddAsync(patient);
                // Lưu thông tin bác sĩ vào database
            

            await _context.SaveChangesAsync();


            // Gửi tin nhắn SMS cho nhân viên mới đăng ký
          
            return CreatedAtAction(nameof(TestGet), new { id = model.AccId }, model);
        }

        


    }
}
