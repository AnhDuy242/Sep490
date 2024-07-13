using BE.DTOs;
using BE.Models;
using BE.Service;
using BE.Service.ImplService;
using BE.Service.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDoctor>>> TestGetAllPatient()
        {
            if (_context.Patients == null || _context.Accounts == null)
            {
                return NotFound();
            }
            var accountsWithPatient = await _context.Accounts
                .Join(
                    _context.Patients,
                    account => account.AccId,
                    patient => patient.PatientId,
                    (account, patient) => new PatientCreationModel
                    {
                        AccId = account.AccId,
                        Email = account.Email,
                        Phone = account.Phone,
                        Password = account.Password,
                        Address = patient.Address,
                        Name = patient.Name,
                        Gender = patient.Gender,
                        Dob = patient.Dob,
                        IsActive = account.IsActive,
                        RoleId = account.RoleId
                    }
                    )
                .ToListAsync();

            return Ok(accountsWithPatient);
        }

        // GET api/<CreatePatientController>/5
        [HttpGet("{id}")]
        public string TestGet(int id)
        {
            return "value";
        }

        // POST api/<CreatePatientController>
        [HttpPost]
        public async Task<ActionResult<Employee>> CreatePatient(PatientCreationModel model)
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


            Account account = new Account
                { 
                    Phone = model.Phone,
                    Password = password,
                    RoleId = 3,
                    Email = model.Email,
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


          
            return CreatedAtAction(nameof(TestGet), new { id = model.AccId }, model);
        }

        


    }
}
