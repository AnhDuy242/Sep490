using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAppointmentController : ControllerBase
    {
        private readonly MedPalContext _context;

        public AdminAppointmentController(MedPalContext context)
        {
            _context = context;
        }

        // GET: api/Appointment/GetAppointmentsByDoctorId
        [HttpGet("GetAppointmentsByDoctorId")]
        public async Task<IActionResult> GetAppointmentsByDoctorId([FromQuery] int doctorId)
        {
            try
            {
                // Lấy danh sách các appointment dựa trên doctorId
                var appointments = await _context.Appointments
                    .Where(a => a.DoctorId == doctorId)
                    .ToListAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        // GET: api/Appointment/GetAppointmentById/5
        [HttpGet("GetAppointmentById/{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            try
            {
                // Tìm appointment theo id
                var appointment = await _context.Appointments
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (appointment == null)
                {
                    return NotFound(new { message = "Appointment not found" });
                }

                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        // POST: api/Appointment/CreateAppointment
        [HttpPost("CreateAppointment")]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.Id }, appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        // PUT: api/Appointment/UpdateAppointment/5
        [HttpPut("UpdateAppointment/{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] Appointment appointment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingAppointment = await _context.Appointments.FindAsync(id);

                if (existingAppointment == null)
                {
                    return NotFound();
                }

                // Cập nhật các thuộc tính của existingAppointment từ model
                existingAppointment.PatientId = appointment.PatientId;
                existingAppointment.DoctorId = appointment.DoctorId;
                existingAppointment.Date = appointment.Date;
                existingAppointment.SlotId = appointment.SlotId;
                existingAppointment.Status = appointment.Status;
                existingAppointment.Note = appointment.Note;

                _context.Appointments.Update(existingAppointment);
                await _context.SaveChangesAsync();

                return Ok(existingAppointment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        // DELETE: api/Appointment/DeleteAppointment/5
        [HttpDelete("DeleteAppointment/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);

                if (appointment == null)
                {
                    return NotFound();
                }

                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Appointment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
    }
}
