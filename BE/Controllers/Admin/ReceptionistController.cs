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
            [HttpDelete("{id}")]
            public void Delete(int id)
            {
            }
        }
    }
