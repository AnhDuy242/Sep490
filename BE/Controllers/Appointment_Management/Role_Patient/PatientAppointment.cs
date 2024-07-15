using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

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
        public async Task<IActionResult> UpdateAppointment(int appId, [FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var appointment = await _alo2Context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Include(a => a.Slot)
                .FirstOrDefaultAsync(a => a.Id == appId);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            // Update appointment properties
            appointment.PatientId = appointmentDto.PatientId;
            appointment.DoctorId = appointmentDto.DoctorId;
            appointment.Date = appointmentDto.Date;
            appointment.SlotId = appointmentDto.SlotId;
            appointment.Note = appointmentDto.Note;

            try
            {
                await _alo2Context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(appId))
                {
                    return NotFound("Appointment not found.");
                }
                else
                {
                    throw;
                }
            }

            return Ok(appointment);
        }
        private bool AppointmentExists(int id)
        {
            return _alo2Context.Appointments.Any(e => e.Id == id);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteAppointment(int appId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var appointment = await _alo2Context.Appointments.FindAsync(appId);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            _alo2Context.Appointments.Remove(appointment);

            try
            {
                await _alo2Context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok("Appointment deleted successfully.");
        }

    }
}
