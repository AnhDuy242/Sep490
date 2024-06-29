using BE.Models;
using BE.Models.DTOs;
using BE.Service;
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
                        Name = receptionist.Name,
                        Gender = receptionist.Gender,
                        Dob = receptionist.Dob,

                    }
                    )
                .Where(a => a.Phone.Equals(phone))
                .FirstOrDefaultAsync();

            return Ok(accountsWithReeptionistInfo);
        }

        
        

        // DELETE api/<ReceptionistController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
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
            _context.Receptionists.Remove(receptionist);
            _context.Accounts.Remove(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteMembers([FromBody] List<ReceptionistAccount> receptionistAccounts)
        {
            if (_context.Accounts == null || _context.Receptionists == null)
            {
                return NotFound();
            }

            if (receptionistAccounts == null || receptionistAccounts.Count == 0)
            {
                return BadRequest("No accounts provided for deletion.");
            }

            // Extract phone numbers from the provided AccountDoctor list
            var id = receptionistAccounts.Select(ra => ra.AccId).ToList();

            // Find accounts and doctors matching the provided phone numbers
            var members = await _context.Accounts.Where(a => id.Contains(a.AccId)).ToListAsync();
            var receptionist = await _context.Receptionists.Where(r => id.Contains(r.RecepId)).ToListAsync();

            if (members.Count == 0 && receptionist.Count == 0)
            {
                return NotFound();
            }

            if (receptionist.Count > 0)
            {
                _context.Receptionists.RemoveRange(receptionist);
            }

            if (members.Count > 0)
            {
                _context.Accounts.RemoveRange(members);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
    }
