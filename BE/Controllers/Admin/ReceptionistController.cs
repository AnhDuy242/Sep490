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
                        account => account.Phone,
                        receptionist => receptionist.Phone,
                        (account, receptionist) => new ReceptionistAccount
                        {
                            Email = account.Email,
                            Phone = account.Phone,
                            Password = account.Password,
                            Name = receptionist.Name,
                            Gender = receptionist.Gender,
                            Age = receptionist.Age,

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
                    account => account.Phone,
                    receptionist => receptionist.Phone,
                    (account, receptionist) => new ReceptionistAccount
                    {
                        Email = account.Email,
                        Phone = account.Phone,
                        Password = account.Password,
                        Name = receptionist.Name,
                        Gender = receptionist.Gender,
                        Age = receptionist.Age,

                    }
                    )
                .Where(a => a.Phone.Equals(phone))
                .FirstOrDefaultAsync();

            return Ok(accountsWithReeptionistInfo);
        }

        // POST api/<ReceptionistController>
        [HttpPost]
            public void Post([FromBody] string value)
            {
            }

            // PUT api/<ReceptionistController>/5
            [HttpPut("{id}")]
            public void Put(int id, [FromBody] string value)
            {
            }

        // DELETE api/<ReceptionistController>/5
        [HttpDelete("{phone}")]
        public async Task<IActionResult> DeleteMember(string phone)
        {
            if (_context.Accounts == null || _context.Receptionists == null)
            {
                return NotFound();
            }
            var member = await _context.Accounts.Where(a => a.Phone.Equals(phone)).FirstOrDefaultAsync();
            var receptionist = await _context.Receptionists.Where(r => r.Phone.Equals(phone)).FirstOrDefaultAsync();
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
            var phones = receptionistAccounts.Select(ra => ra.Phone).ToList();

            // Find accounts and doctors matching the provided phone numbers
            var members = await _context.Accounts.Where(a => phones.Contains(a.Phone)).ToListAsync();
            var receptionist = await _context.Receptionists.Where(r => phones.Contains(r.Phone)).ToListAsync();

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
