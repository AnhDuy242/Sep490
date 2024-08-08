using AutoMapper;
using BE.DTOs;
using BE.Models;
using CloudinaryDotNet.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistProfileController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public ReceptionistProfileController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/ReceptionistProfile/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReceptionistAccount>> GetReceptionistProfile(int id)
        {
            var receptionist = await _context.Receptionists
                .Include(r => r.Recep) // Nếu cần, ánh xạ các thuộc tính liên quan
                .FirstOrDefaultAsync(r => r.RecepId == id);

            if (receptionist == null)
            {
                return NotFound();
            }

            var receptionistDto = _mapper.Map<ReceptionistAccount>(receptionist);
            return Ok(receptionistDto);
        }

        // PUT: api/ReceptionistProfile/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReceptionistProfile(int id, ReceptionistAccount receptionistAccount)
        {
            if (id != receptionistAccount.AccId)
            {
                return BadRequest();
            }

            var receptionist = await _context.Receptionists
                .Include(r => r.Recep) // Nếu cần, ánh xạ các thuộc tính liên quan
                .FirstOrDefaultAsync(r => r.RecepId == id);

            if (receptionist == null)
            {
                return NotFound();
            }

            // Kiểm tra email đã tồn tại hay chưa
            bool emailExists = await _context.Accounts
                .AnyAsync(r => r.Email == receptionistAccount.Email && r.Receptionist.RecepId != id);

            if (emailExists)
            {
                return Conflict(new { message = "Email đã tồn tại." });
            }

            // Kiểm tra số điện thoại đã tồn tại hay chưa
            bool phoneExists = await _context.Accounts
                .AnyAsync(r => r.Phone == receptionistAccount.Phone && r.Receptionist.RecepId != id);

            if (phoneExists)
            {
                return Conflict(new { message = "Số điện thoại đã tồn tại." });
            }

            _mapper.Map(receptionistAccount, receptionist);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReceptionistExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new {message ="Cập nhật thông tin thành công"});
        }


        // POST: api/ReceptionistProfile
        [HttpPost]
        public async Task<ActionResult<ReceptionistAccount>> CreateReceptionistProfile(ReceptionistAccount receptionistAccount)
        {
            var receptionist = _mapper.Map<Receptionist>(receptionistAccount);

            _context.Receptionists.Add(receptionist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReceptionistProfile), new { id = receptionist.RecepId }, receptionistAccount);
        }

        private bool ReceptionistExists(int id)
        {
            return _context.Receptionists.Any(e => e.RecepId == id);
        }
    }
}
