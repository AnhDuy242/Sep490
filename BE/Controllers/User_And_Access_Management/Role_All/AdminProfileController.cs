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
            var admin = await _context.Admins
                .Include(a => a.AdminNavigation)
                .FirstOrDefaultAsync(a => a.AdminId == id);

            if (admin == null)
            {
                return NotFound(new { Error = "Không tìm thấy admin " });
            }

            // Ensure AdminNavigation is not null
            if (admin.AdminNavigation == null)
            {
                admin.AdminNavigation = new Account();
            }

            // Check if the email or phone is being updated
            bool isEmailUpdated = admin.AdminNavigation.Email != adminDto.Email;
            bool isPhoneUpdated = admin.AdminNavigation.Phone != adminDto.Phone;

            // Check if the new email or phone number already exists in the database
            if (isEmailUpdated)
            {
                bool emailExists = await _context.Accounts
                    .AnyAsync(a => a.Email == adminDto.Email && a.AccId != admin.AdminNavigation.AccId);

                if (emailExists)
                {
                    return BadRequest(new { Error = "Email đã tồn tại" });
                }
            }

            if (isPhoneUpdated)
            {
                bool phoneExists = await _context.Accounts
                    .AnyAsync(a => a.Phone == adminDto.Phone && a.AccId != admin.AdminNavigation.AccId);

                if (phoneExists)
                {
                    return BadRequest(new { Error = "Số điện thoại đã tồn tại" });
                }
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
                return Ok(new { Message = "Cập nhật thành công" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { Error = "Đã có lỗi xảy ra" });
            }
        }



        private bool AdminExists(int id)
        {
            return _context.Admins.Any(e => e.AdminId == id);
        }
    }
}
