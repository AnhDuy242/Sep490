using AutoMapper;
using BE.DTOs.AdminAccountDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.User_And_Access_Management.Role_All
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdminProfileController : Controller
    {

        private readonly IMapper _mapper;
        private readonly MedPalContext _context;

        public AdminProfileController(IMapper mapper, MedPalContext context)
        {
            _mapper = mapper;
            _context = context;
        }
        // GET: api/Admin/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminAccountDTO>> GetAdmin(int id)
        {
            var admin = await _context.Admins
                .Include(a => a.AdminNavigation)
                .FirstOrDefaultAsync(a => a.AdminId == id);

            if (admin == null)
            {
                return NotFound();
            }

            var adminDto = new AdminAccountDTO
            {
                Id = admin.AdminId,
                Name = admin.Name,
                Email = admin.AdminNavigation.Email,
                Phone = admin.AdminNavigation.Phone,
                Password = admin.AdminNavigation.Password // Ensure this is correctly mapped
            };

            return Ok(adminDto);
        }

        // PUT: api/Admin/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmin(int id, AdminAccountDTO adminDto)
        {
            if (id != adminDto.Id)
            {
                return BadRequest();
            }

            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
            {
                return NotFound();
            }

            _mapper.Map(adminDto, admin);

            _context.Entry(admin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdminExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        private bool AdminExists(int id)
        {
            return _context.Admins.Any(e => e.AdminId == id);
        }
    }
}
