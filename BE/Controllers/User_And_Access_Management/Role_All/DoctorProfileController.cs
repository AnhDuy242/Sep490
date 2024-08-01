using AutoMapper;
using BE.DTOs.EmployeeDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.User_And_Access_Management.Role_All
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DoctorProfileController : ControllerBase
    {
         
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public DoctorProfileController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Get all doctors
        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.Dep) // Include related entities if needed
                .ToListAsync();

            var doctorDtos = _mapper.Map<List<DoctorDto>>(doctors);
            return Ok(doctorDtos);
        }

        // Get doctor by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Dep) // Include related entities if needed
                .FirstOrDefaultAsync(d => d.DocId == id);

            if (doctor == null)
            {
                return NotFound();
            }

            var doctorDto = _mapper.Map<DoctorDto>(doctor);
            return Ok(doctorDto);
        }
    }
}

