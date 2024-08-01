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
        public async Task<IActionResult> UpdateAdmin(int id, [FromBody] AdminAccountDTO adminDto)
        {
            // Find the admin by ID from the URL
            var admin = await _context.Admins.Include(a => a.AdminNavigation).FirstOrDefaultAsync(a => a.AdminId == id);
            if (admin == null)
            {
                return NotFound(new { Error = "Admin not found" });
            }

            // Ensure AdminNavigation is not null
            if (admin.AdminNavigation == null)
            {
                // Initialize AdminNavigation if needed, or handle this case accordingly
                admin.AdminNavigation = new Account();
            }

            // Update the admin properties
            admin.Name = adminDto.Name;
            admin.AdminNavigation.Email = adminDto.Email;
            admin.AdminNavigation.Phone = adminDto.Phone;
            // Note: Update password only if it's provided
            if (!string.IsNullOrWhiteSpace(adminDto.Password))
            {
                admin.AdminNavigation.Password = adminDto.Password;
            }

            try
            {
                _context.Admins.Update(admin);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Admin updated successfully" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { Error = "An error occurred while updating the admin" });
            }
        }




        private bool AdminExists(int id)
        {
            return _context.Admins.Any(e => e.AdminId == id);
        }
    }
}
