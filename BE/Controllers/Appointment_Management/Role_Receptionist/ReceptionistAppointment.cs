using AutoMapper;
using BE.DTOs.AppointmentDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace BE.Controllers.Appointment
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistAppointment : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public ReceptionistAppointment(MedPalContext context, IMapper mapper) { _context = context; _mapper = mapper; }

        [HttpGet] 
        public async Task<IActionResult> GetAllAppointment()
        {
            var appointments = _context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            return Ok(list);
        }
        [HttpPut]
        public async Task<IActionResult> ApproveAppointment(int appId, string status)
        {
            var appointment = await _context.Appointments.FindAsync(appId);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            appointment.Status = status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Appointment approved successfully.");
        }
      
    }
}
