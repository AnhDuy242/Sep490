using AutoMapper;
using BE.DTOs.DoctorDto;
using BE.DTOs.PatientDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Customer_Care_Management.Role_Doctor
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DoctorCustomerCareController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public DoctorCustomerCareController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetListPatientByDoctorId(int docid)
        {
            var patients = await _context.MedicalNotebooks
             .Where(mn => mn.DoctorId == docid)
             .Select(mn => mn.Patient)
             .Distinct()
             .ToListAsync();

            if (patients == null || !patients.Any())
            {
                return NotFound();
            }
            var p = _mapper.Map<List<PatientReceptionist>>(patients);
            return Ok(p);
        }
        [HttpGet]
        public async Task<IActionResult> GetListDoctorByPatientId(int pid)
        {
            var doctors = await _context.MedicalNotebooks
                .Where(mn => mn.PatientId == pid)
                .Select(mn => mn.Doctor)
                .Distinct()
                .ToListAsync();

            if (doctors == null || !doctors.Any())
            {
                return NotFound();
            }
            var p = _mapper.Map<List<DoctorMarketing>>(doctors);

            return Ok(p);
        }
    }
}
