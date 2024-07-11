using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Appointment
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PatientAppointment : ControllerBase
    {
        private readonly Alo2Context _alo2Context;

        public PatientAppointment (Alo2Context alo2Context)
        {
            _alo2Context = alo2Context;
        }

        [HttpGet]
        public async Task<OkObjectResult> GetAppointment(int pid)
        {
            var appointments = _alo2Context.Appointments.Where(x => x.PatientId == pid).ToList();
            return Ok(appointments);
        }

    }
}
