using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Appointment
{
    [Route("api/[controller]")]
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
    }
}
