using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Appointment_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PatientAppointment : ControllerBase
    {
        private readonly MedPalContext _alo2Context;

        public PatientAppointment(MedPalContext alo2Context)
        {
            _alo2Context = alo2Context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointment(int pid)
        {
            var appointments = _alo2Context.Appointments.Where(x => x.PatientId == pid).ToList();
            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Models.Appointment appointment = new Models.Appointment()
            {
                Date = appointmentDto.Date,
                PatientId = appointmentDto.PatientId,
                DoctorId = appointmentDto.DoctorId,
                SlotId = appointmentDto.SlotId,
                Status = "Đang chờ phê duyệt",
            };
            _alo2Context.Appointments.Add(appointment);
            _alo2Context.SaveChanges();
            return Ok(appointment);
        }


        [HttpPost]
        public async Task<IActionResult> UpdateAppointment([FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
        }
    }
}
