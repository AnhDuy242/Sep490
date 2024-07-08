﻿using AutoMapper;
using BE.DTOs;
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
                    account => account.AccId,
                    doctor => doctor.DocId,
                    (account, doctor) => new { account, doctor }
                )
                .Join(
                    _context.Departments,
                    accountDoctor => accountDoctor.doctor.DepId,
                    department => department.DepId,
                    (accountDoctor, department) => new AccountDoctor
                    {
                        AccId = accountDoctor.account.AccId,
                        Email = accountDoctor.account.Email,
                        Phone = accountDoctor.account.Phone,
                        Password = accountDoctor.account.Password,
                        Name = accountDoctor.doctor.Name,
                        Gender = accountDoctor.doctor.Gender,
                        Age = accountDoctor.doctor.Age,
                        // Các thuộc tính khác của Account
                        DepartmentName = department.Name,
                        IsActive = accountDoctor.account.IsActive
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
                    account => account.AccId,
                    doctor => doctor.DocId,
                    (account, doctor) => new { account, doctor }
                )
                .Join(
                    _context.Departments,
                    accountDoctor => accountDoctor.doctor.DepId,
                    department => department.DepId,
                    (accountDoctor, department) => new AccountDoctor
                    {
                        AccId = accountDoctor.account.AccId,
                        Email = accountDoctor.account.Email,
                        Phone = accountDoctor.account.Phone,
                        Password = accountDoctor.account.Password,
                        Name = accountDoctor.doctor.Name,
                        Gender = accountDoctor.doctor.Gender,
                        Age = accountDoctor.doctor.Age,
                        // Các thuộc tính khác của Account
                        DepartmentName = department.Name,
                        IsActive = accountDoctor.account.IsActive
                    }
                )
                .Where(a => a.Phone.Equals(phone))
                .FirstOrDefaultAsync();

            return Ok(accountsWithDoctorInfo);
        }

        // POST api/<DoctorController>


        // PUT api/<DoctorController>/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateMember(int id, [FromBody] AccountDoctor accountDoctor)
        //{
        //    if (_context.Accounts == null || _context.Doctors == null)
        //    {
        //        return NotFound();
        //    }
        //    var member = await _context.Accounts.Where(a => a.AccId.Equals(id)).FirstOrDefaultAsync();
        //    var doctor = await _context.Doctors.Where(a => a.DocId.Equals(id)).FirstOrDefaultAsync();
        //    if (member == null)
        //    {
        //        return NotFound();
        //    }

            
        //    _context.Doctors.Update(doctor);
        //    _context.Accounts.Update(member);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}


        // DELETE api/<DoctorController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            if (_context.Accounts == null || _context.Doctors == null)
            {
                return NotFound();
            }
            var member = await _context.Accounts.Where(a => a.AccId.Equals(id)).FirstOrDefaultAsync();
            var doctor = await _context.Doctors.Where(a => a.DocId.Equals(id)).FirstOrDefaultAsync();
            if (member == null)
            {
                return NotFound();
            }

            member.IsActive = false;
            doctor.IsActive = false;
            _context.Doctors.Update(doctor);
            _context.Accounts.Update(member);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut]
        public async Task<IActionResult> DeleteMembers([FromBody] List<AccountDoctor> accountDoctors)
        {
            if (_context.Accounts == null || _context.Doctors == null)
            {
                return NotFound();
            }

            if (accountDoctors == null || accountDoctors.Count == 0)
            {
                return BadRequest("No accounts provided for deletion.");
            }

            // Extract phone numbers from the provided AccountDoctor list
            var id = accountDoctors.Select(ad => ad.AccId).ToList();

            // Find accounts and doctors matching the provided id numbers
            var members = await _context.Accounts.Where(a => id.Contains(a.AccId)).ToListAsync();
            var doctors = await _context.Doctors.Where(d => id.Contains(d.DocId)).ToListAsync();



            if (members.Count == 0 && doctors.Count == 0)
            {
                return NotFound();
            }

            if (doctors.Count > 0)
            {
                foreach(Doctor d in doctors)
                {
                    d.IsActive = false;
                }
                _context.Doctors.UpdateRange(doctors);
            }

            if (members.Count > 0)
            {
                foreach (Account c in members)
                {
                    c.IsActive = false;
                }
                _context.Accounts.UpdateRange(members);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

                                                                }
}
