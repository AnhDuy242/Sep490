using AutoMapper;
using BE.DTOs;
using BE.DTOs.AppointmentDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Appointment_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdminAppointment : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public AdminAppointment(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllAppointment()
        {
            var appointments = _context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            return Ok(list);
        }
        [HttpGet]
        public async Task<IActionResult> GetAppointmentsForDoctor(int doctorId, DateTime startDate, DateTime endDate)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.Date >= startDate && a.Date <= endDate)
                .Select(a => new { a.Id, a.Date, a.SlotId })
                .ToListAsync();

            return Ok(appointments);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateAppointmentsStatus([FromBody] UpdateAppointmentsRequest request)
        {
            // Validate the request
            if (request.ScheduleId <= 0 || request.SlotId <= 0 || request.DoctorId <= 0)
            {
            }

            // Fetch the appointments based on ScheduleId, SlotId, and DoctorId
            var appointments = await _context.Appointments
                .Where(a => a.ScheduleId == request.ScheduleId
                             && a.SlotId == request.SlotId
                             && a.DoctorId == request.DoctorId) // Thêm điều kiện DoctorId
                .ToListAsync();

            if (!appointments.Any())
            {
            }

            // Update the status of the appointments to "Đã hủy"
            foreach (var appointment in appointments)
            {
                appointment.Status = "Đã hủy"; // Set status to "Đã hủy"
                _context.Appointments.Update(appointment);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Đã có lỗi xảy ra.");
            }

            return Ok(new { Message = "Cập nhật thành công!" });
        }





        private bool ScheduleExists(int id)
        {
            return _context.Schedules.Any(e => e.Id == id);
        }
    }
}
