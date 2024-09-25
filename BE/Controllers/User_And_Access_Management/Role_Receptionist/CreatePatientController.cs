using BE.DTOs;
using BE.DTOs.AppointmentDto;
using BE.DTOs.PatientDto;
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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientWithAppointmentsDto>>> GetAllPatientsWithAppointments()
        {
            if (_context.Patients == null || _context.Accounts == null || _context.Appointments == null)
            {
                return NotFound();
            }

            var patientsWithAppointments = await _context.Accounts
                .Where(account => account.Patient != null)
                .Select(account => new PatientWithAppointmentsDto
                {
                    AccId = account.AccId,
                    Phone = account.Phone,
                    Email = account.Email,
                    Password = account.Password,
                    Address = account.Patient.Address,
                    Name = account.Patient.Name,
                    Gender = account.Patient.Gender,
                    Dob = account.Patient.Dob,
                    IsActive = account.IsActive,
                    Check = account.Patient.Check,
                    RoleId = account.RoleId,
                    Appointments = account.Patient.Appointments.Select(appointment => new AppointmentReceptionistDto
                    {
                        Id = appointment.Id,
                        PatientId = appointment.PatientId,
                        DoctorId = (int)appointment.DoctorId,
                        Date = appointment.Date,
                        SlotId = appointment.SlotId,
                        Status = appointment.Status,
                        Note = appointment.Note,
                        ServiceId = appointment.ServiceId,
                        ServiceName=appointment.Service.Name,
                        Check=appointment.Check,
                        ScheduleId = appointment.ScheduleId,
                    }
                    ).ToList()
                })
                .ToListAsync();

            return Ok(patientsWithAppointments);
        }

        // GET api/<CreatePatientController>/5
        [HttpGet("{id}")]
        public string TestGet(int id)
        {
            return "value";
        }
        [HttpPut("{patientId}")]
        public async Task<IActionResult> UpdateCheckStatus(int patientId, [FromBody] PatientUpdateCheckDto model)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null)
            {
                return NotFound("Không tìm thấy bệnh nhân.");
            }

            patient.Check = model.Check;

            await _context.SaveChangesAsync();

            return Ok("Cập nhật trạng thái thành công.");
        }


        // POST api/<CreatePatientController>
        [HttpPost]
        public async Task<ActionResult<Employee>> CreatePatient(PatientCreationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if phone number already exists
            if (!_validateService.CheckPhoneNumberExist(model.Phone))
            {
                return BadRequest(new { message = "Số điện thoại đã tồn tại" });
            }

            // Check if email already exists
            if (!string.IsNullOrEmpty(model.Email) && _context.Accounts.Any(a => a.Email == model.Email))
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            // Generate random password
            string password = _validateService.GenerateRandomPassword();

            // Create new account
            Account account = new Account
            {
                Phone = model.Phone,
                Password = password,
                RoleId = 3,
                Email = model.Email,
                IsActive = true,
                
            };

            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();

            // Create new patient
            Patient patient = new Patient
            {
                PatientId = account.AccId,
                Name = model.Name,
                Gender = model.Gender,
                Dob = model.Dob,
                Address = model.Address,
                IsActive = true,
                Check=1
            };

            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();

            // Return success response
            return CreatedAtAction(nameof(TestGet), new { id = patient.PatientId }, model);
        }
     


    }
}
