using AutoMapper;
using BE.DTOs.DoctorDto;
using BE.DTOs.ServiceDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace BE.Controllers.Marketing
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HeaderController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public HeaderController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDoctor()
        {
            var listDoc = _context.Doctors.Include(x => x.Services).ThenInclude(x => x.Dep).Where(x => x.IsActive == true).ToList();
            var result = _mapper.Map<List<DoctorMarketing>>(listDoc);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctorDetailById(int id)
        {
            var listDoc = _context.Doctors.Include(x => x.Services).ThenInclude(x => x.Dep).Where(x => x.IsActive == true).Where(x => x.DocId == id).ToList();
            var result = _mapper.Map<List<DoctorMarketing>>(listDoc);
            return Ok(result);
        }
        [HttpGet]
        public async Task<IActionResult> GetDoctorDetailAndDepartmentById(int id)
        {
            var doctor = await _context.Doctors
                .Include(x => x.Services)
                .ThenInclude(x => x.Dep)
                .Include(x => x.Doc) // Đảm bảo ánh xạ thông tin của bác sĩ
                .Where(x => x.IsActive == true)
                .Where(x => x.DocId == id)
                .FirstOrDefaultAsync();

            if (doctor == null)
            {
                return NotFound();
            }

            var result = _mapper.Map<DoctorMarketing>(doctor);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetService()
        {
            var list = _context.Services.Include(x => x.Dep).Where(x => x.IsActive == true).ToList();
            var result = _mapper.Map<List<ServiceMarketing>>(list);
            return Ok(result);
        }
    }
}
