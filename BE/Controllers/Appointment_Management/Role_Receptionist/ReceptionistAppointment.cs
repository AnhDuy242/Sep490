using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Appointment
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistAppointment : ControllerBase
    {
        private readonly MedPalContext _context;
        public ReceptionistAppointment(MedPalContext context) { _context = context; }

        [HttpGet] 
        public async Task<IActionResult> GetAllAppointment()
        {
            var list = _context.Appointments.ToList();
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
