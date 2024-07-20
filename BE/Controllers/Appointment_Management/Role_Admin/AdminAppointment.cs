using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Appointment_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdminAppointment : ControllerBase
    {
        private readonly MedPalContext _context;
        public AdminAppointment(MedPalContext context)
        {
            _context = context;
        }


    }
}
