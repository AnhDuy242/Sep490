using AutoMapper;
using BE.DTOs.EmployeeDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Customer_Care_Management.Role_Receptionist
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistCustomerCareController : Controller
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public ReceptionistCustomerCareController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllReceptionistsConversation()
        {
            var receptionists = await _context.Receptionists
                .Include(r => r.Recep)  // Ensure the navigation property is loaded
                .ToListAsync();

            var receptionistDtos = _mapper.Map<List<ReceptionistDto>>(receptionists);
            return Ok(receptionistDtos);
        }
    }
}
