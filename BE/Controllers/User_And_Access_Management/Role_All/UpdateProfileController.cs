using AutoMapper;
using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.User_And_Access_Management.Role_All
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpdateProfileController : Controller
    {
      
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public UpdateProfileController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorAndAccount(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Doc) // Include related account
                .FirstOrDefaultAsync(d => d.DocId == id);

            if (doctor == null)
            {
                return NotFound();
            }

            // Map to DTO
            var updateDto = new UpdateDoctorAndAccountDto
            {
                Img = doctor.Img,
                Description = doctor.Description,
                AccountPhone = doctor.Doc.Phone,
                AccountEmail = doctor.Doc.Email,
                AccountPassword = doctor.Doc.Password // Consider not exposing the password
            };

            return Ok(updateDto);
        }
        // Update specific fields of doctor and account
        [HttpPut("/doctorProfile/{id}")]
        public async Task<IActionResult> UpdateDoctorAndAccount(int id, [FromBody] UpdateDoctorAndAccountDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the doctor and related account
            var doctor = await _context.Doctors
                .Include(d => d.Doc) // Include related account
                .FirstOrDefaultAsync(d => d.DocId == id);

            if (doctor == null)
            {
                return NotFound();
            }

            // Update doctor details
            if (updateDto.Img != null)
            {
                doctor.Img = updateDto.Img;
            }

            if (updateDto.Description != null)
            {
                doctor.Description = updateDto.Description;
            }

            // Update account details
            var account = doctor.Doc;
            if (account != null)
            {
                if (updateDto.AccountPhone != null)
                {
                    account.Phone = updateDto.AccountPhone;
                }

                if (updateDto.AccountEmail != null)
                {
                    account.Email = updateDto.AccountEmail;
                }

                if (updateDto.AccountPassword != null)
                {
                    account.Password = updateDto.AccountPassword; // Consider hashing the password
                }
            }

            // Save changes
            _context.Doctors.Update(doctor);
            if (account != null)
            {
                _context.Accounts.Update(account);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Thông tin bác sĩ và tài khoản đã được cập nhật thành công!" });
        }
    }
}
