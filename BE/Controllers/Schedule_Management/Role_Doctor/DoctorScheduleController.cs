using AutoMapper;
using BE.DTOs.ScheduleDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Schedule_Management.Role_Doctor
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DoctorScheduleController : ControllerBase
    {
      
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public DoctorScheduleController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllSchedulesByDoctorId(int id)
        {
            var list = _context.Schedules.Where(x =>  x.DoctorId == id).Include(x => x.Doctor).ToList();
            var lists = _mapper.Map<List<ScheduleDoctor>>(list);
            return Ok(lists);
        }
    }
}
