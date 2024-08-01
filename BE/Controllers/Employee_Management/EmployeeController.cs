using AutoMapper;
using BE.DTOs;
using BE.DTOs.EmployeeDto;
using BE.Models;
using BE.Service.ImplService;
using BE.Service.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        private readonly IValidateService _validateService;

        public EmployeeController(MedPalContext context, IMapper mapper, IValidateService validateService)
        {
            _context = context;
            _mapper = mapper;
            _validateService = validateService;

        }

        // Add a new Doctor
        // Create a Doctor
        [HttpPost]
        public async Task<IActionResult> CreateDoctor([FromBody] DoctorDto doctorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email or phone number already exists
            var existingAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Email == doctorDto.Email || a.Phone == doctorDto.Phone);

            if (existingAccount != null)
            {
                return Conflict("Email hoặc số điện thoại đã được sử dụng.");
            }

            // Create new account
            var account = new Account
            {
                Email = doctorDto.Email,
                Phone = doctorDto.Phone,
                Password = doctorDto.Password,
                RoleId = doctorDto.RoleId ?? 0, // Ensure this role ID exists in the Role table
                IsActive = doctorDto.IsActive
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // Create doctor
            var doctor = new Doctor
            {
                Name = doctorDto.Name,
                Gender = doctorDto.Gender,
                Age = doctorDto.Age,
                IsActive = doctorDto.IsActive,
                Img = doctorDto.Img,
                Description = doctorDto.Description,
                DepId = doctorDto.DepId,
                Doc = account // Link the newly created account
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Bác sĩ đã được tạo thành công!", doctor });
        }


        [HttpPost("Create")]
        public async Task<IActionResult> CreateReceptionist([FromBody] ReceptionistDto receptionistDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email or phone number already exists
            var existingAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.Email == receptionistDto.Email || a.Phone == receptionistDto.Phone);

            if (existingAccount != null)
            {
                return Conflict("Email hoặc số điện thoại đã được sử dụng.");
            }

            // Create new account
            var account = new Account
            {
                Email = receptionistDto.Email,
                Phone = receptionistDto.Phone,
                Password = receptionistDto.Password,
                RoleId = receptionistDto.RoleId ?? 0, // Provide a default value if RoleId is null
                IsActive = receptionistDto.IsActive
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            // Create receptionist
            var receptionist = new Receptionist
            {
                Name = receptionistDto.Name,
                Gender = receptionistDto.Gender,
                Dob = receptionistDto.Dob,
                Recep = account // Link the newly created account
            };

            _context.Receptionists.Add(receptionist);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Nhân viên lễ tân đã được tạo thành công!", receptionist });
        }

        // Add other CRUD actions (e.g., Get, Update, Delete) as needed
    

    // Get all Doctors
    [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _context.Doctors.ToListAsync();
            var doctorDtos = _mapper.Map<List<DoctorDto>>(doctors);
            return Ok(doctorDtos);
        }

        // Get all Receptionists
        [HttpGet]
        public async Task<IActionResult> GetAllReceptionists()
        {
            var receptionists = await _context.Receptionists.ToListAsync();
            var receptionistDtos = _mapper.Map<List<ReceptionistDto>>(receptionists);
            return Ok(receptionistDtos);
        }
    }
}
