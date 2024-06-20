using AutoMapper;
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
    public class DoctorController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly Alo2Context _context;
        
        public DoctorController(IMapper mapper, Alo2Context context)
        {
            _mapper = mapper;
            _context = context;
        }
        // GET: api/<DoctorController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDoctor>>> GetDoctorAccount()
        {
            if (_context.Doctors == null || _context.Accounts == null || _context.Departments == null)
            {
                return NotFound();
            }

            var accountsWithDoctorInfo = await _context.Accounts
                .Join(
                    _context.Doctors,
                    account => account.Phone,
                    doctor => doctor.Phone,
                    (account, doctor) => new { account, doctor }
                )
                .Join(
                    _context.Departments,
                    accountDoctor => accountDoctor.doctor.DepartmentId,
                    department => department.Id,
                    (accountDoctor, department) => new AccountDoctor
                    {
                        Email = accountDoctor.account.Email,
                        Phone = accountDoctor.account.Phone,
                        Password = accountDoctor.account.Password,
                        Name = accountDoctor.doctor.Name,
                        Gender = accountDoctor.doctor.Gender,
                        Age = accountDoctor.doctor.Age,
                        // Các thuộc tính khác của Account
                        DepartmentName = department.Name
                    }
                )
                .ToListAsync();

            return Ok(accountsWithDoctorInfo);
        }

        // Class để chứa kết quả



        // GET api/<DoctorController>/5
        [HttpGet("{phone}")]
        public async Task<ActionResult<AccountDoctor>> GetDoctorAccountDetail(string phone)
        {
            if (_context.Doctors == null || _context.Accounts == null || _context.Departments == null)
            {
                return NotFound();
            }

            var accountsWithDoctorInfo = await _context.Accounts
                .Join(
                    _context.Doctors,
                    account => account.Phone,
                    doctor => doctor.Phone,
                    (account, doctor) => new { account, doctor }
                )
                .Join(
                    _context.Departments,
                    accountDoctor => accountDoctor.doctor.DepartmentId,
                    department => department.Id,
                    (accountDoctor, department) => new AccountDoctor
                    {
                        Email = accountDoctor.account.Email,
                        Phone = accountDoctor.account.Phone,
                        Password = accountDoctor.account.Password,
                        Name = accountDoctor.doctor.Name,
                        Gender = accountDoctor.doctor.Gender,
                        Age = accountDoctor.doctor.Age,
                        // Các thuộc tính khác của Account
                        DepartmentName = department.Name
                    }
                )
                .Where(a => a.Phone.Equals(phone))
                .FirstOrDefaultAsync();

            return Ok(accountsWithDoctorInfo);
        }

        // POST api/<DoctorController>
        [HttpPost]
        public void Post([FromBody] string value)
        {

        }

        // PUT api/<DoctorController>/5
        [HttpPut("{phone}")]
        public async Task<IActionResult> UpdateDoctor(string phone, AccountDoctor accountDoctor)
        {
            

            // Chuyển đổi từ AccountDoctor sang Account bằng AutoMapper
            var account = _mapper.Map<Account>(accountDoctor);
            Doctor doctor = _context.Doctors.Where(d => d.Phone.Equals(phone)).FirstOrDefault();
            if (doctor == null)
            {
                return BadRequest("Doctor isn't exist");
            }
            doctor.Phone = accountDoctor.Phone;
            _context.Entry(account).State = EntityState.Modified;
            _context.Entry(doctor).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorExists(phone))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        private bool DoctorExists(string id)
        {
            return (_context.Doctors?.Any(d => d.Phone.Equals(id))).GetValueOrDefault();
        }

        // DELETE api/<DoctorController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
