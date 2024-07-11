using BE.DTOs;
using BE.Models;
using BE.Models.DTOs;
using BE.Service;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceptionistController : ControllerBase
    {

        private readonly Alo2Context _context;

        public ReceptionistController(Alo2Context context)
        {

            _context = context;
        }
        // GET: api/<ReceptionistController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReceptionistAccount>>> GetReceptionistAccount()
        {
            if (_context.Doctors == null || _context.Accounts == null || _context.Departments == null)
            {
                return NotFound();
            }
            var accountsWithReeptionistInfo = await _context.Accounts
                .Join(
                    _context.Receptionists,
                    account => account.AccId,
                    receptionist => receptionist.RecepId,
                    (account, receptionist) => new ReceptionistAccount
                    {
                        AccId = account.AccId,
                        Email = account.Email,
                        Phone = account.Phone,
                        Password = account.Password,
                        Name = receptionist.Name,
                        Gender = receptionist.Gender,
                        Dob = receptionist.Dob,
                        IsActive = account.IsActive
                    }
                    )
                .ToListAsync();

            return Ok(accountsWithReeptionistInfo);
        }

        // GET api/<ReceptionistController>/5
        [HttpGet("{phone}")]
        public async Task<ActionResult<IEnumerable<ReceptionistAccount>>> GetReceptionistAccountDetail(string phone)
        {
            if (_context.Doctors == null || _context.Accounts == null || _context.Departments == null)
            {
                return NotFound();
            }
            var accountsWithReeptionistInfo = await _context.Accounts
                .Join(
                    _context.Receptionists,
                    account => account.AccId,
                    receptionist => receptionist.RecepId,
                    (account, receptionist) => new ReceptionistAccount
                    {
                        AccId = account.AccId,
                        Email = account.Email,
                        Phone = account.Phone,
                        Password = account.Password,
                        RoleId = account.RoleId,
                        Name = receptionist.Name,
                        Gender = receptionist.Gender,
                        Dob = receptionist.Dob,
                        IsActive = account.IsActive
                    }
                    )
                .Where(a => a.Phone.Equals(phone))
                .FirstOrDefaultAsync();

            return Ok(accountsWithReeptionistInfo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMembers(int id, ReceptionistAccount model)
        {
            if (_context.Accounts == null || _context.Receptionists == null)
            {
                return NotFound();
            }
            var member = await _context.Accounts.Where(a => a.AccId.Equals(id)).FirstOrDefaultAsync();
            var receptionist = await _context.Receptionists.Where(r => r.RecepId.Equals(id)).FirstOrDefaultAsync();
            if (member == null)
            {
                return NotFound();
            }

            //update account
            member.Email = model.Email;
            member.Phone = model.Phone;
            member.Password = model.Password;
            member.IsActive = model.IsActive;

            //update receptionist
            receptionist.Name = model.Name;
            receptionist.Gender = model.Gender;
            receptionist.Dob = model.Dob;


            _context.Receptionists.Update(receptionist);
            _context.Accounts.Update(member);
            await _context.SaveChangesAsync();

            //return
            ReceptionistAccount newUpdate = new ReceptionistAccount
            {
                AccId = member.AccId,
                Email = member.Email,
                Phone = member.Phone,
                Password = member.Password,
                RoleId = member.RoleId,
                Name = receptionist.Name,
                Gender = receptionist.Gender,
                Dob = receptionist.Dob,
                IsActive = member.IsActive
            };
            return CreatedAtAction(nameof(GetReceptionistAccountDetail), new {phone =  newUpdate.Phone}, newUpdate);
        }




    }
}
