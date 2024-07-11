using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Appointment
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdminAppointment : ControllerBase
    {
        private readonly Alo2Context _context;
        public AdminAppointment(Alo2Context context)
        {
            _context = context;
        }
    }
}
