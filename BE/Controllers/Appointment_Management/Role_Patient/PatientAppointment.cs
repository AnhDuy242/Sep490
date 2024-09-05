using AutoMapper;
using BE.DTOs.AppointmentDto;
using BE.DTOs.DateDto;
using BE.DTOs.DepartmentDto;
using BE.DTOs.DoctorDto;
using BE.DTOs.PatientDto;
using BE.DTOs.ScheduleDto;
using BE.DTOs.ServiceDto;
using BE.DTOs.SlotDto;
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
        private readonly IMapper _mapper;

        public PatientAppointment(MedPalContext alo2Context, IMapper mapper)
        {
            _alo2Context = alo2Context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointment(int pid)
        {
            var appointments = _alo2Context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).Include(x => x.Service).ThenInclude(x => x.Dep).Where(x => x.PatientId == pid).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            return Ok(list);
        }
        [HttpGet]
        public async Task<IActionResult> GetAppointmentForDoctor(int did)
        {
            var appointments = _alo2Context.Appointments.Include(x => x.Doctor).Include(x => x.Patient).Include(x => x.Slot).Include(x => x.Service).ThenInclude(x => x.Dep).Where(x => x.DoctorId == did).ToList();
            var list = _mapper.Map<List<AppointmentPatient>>(appointments);
            return Ok(list);
        }


        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentCreate appointmentDto)
        {

            Models.Appointment appointment = new Models.Appointment()
            {
                Date = appointmentDto.Date.Date,
                PatientId = appointmentDto.PatientId,
                DoctorId = appointmentDto.DoctorId,
                SlotId = appointmentDto.SlotId,
                Status = "Đang chờ phê duyệt",
                ServiceId = appointmentDto.ServiceId,
            };
            if (appointment.DoctorId != null)
            {
                var s = _alo2Context.Schedules.Include(x => x.AppointmentsNavigation).Include(x => x.Doctor).Where(x => x.DoctorId == appointment.DoctorId).FirstOrDefault(x => x.Date == appointment.Date);
                appointment.ScheduleId = s.Id;
            }
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
            appointment.Status = "Đang chờ phê duyệt";
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
                return BadRequest(ex.Message);
            }

            return Ok("Appointment deleted successfully.");
        }
        [HttpGet]
        public async Task<IActionResult> GetDoctorsByDepartment(int departmentId)
        {
            // Lấy danh sách bác sĩ theo departmentId
            var doctors = await _alo2Context.Doctors
                .Include(d => d.Dep)
                .Where(d => d.DepId == departmentId && (bool)d.IsActive)
                .ToListAsync();

            // Kiểm tra nếu không có bác sĩ nào thuộc phòng ban được chỉ định
            if (!doctors.Any())
            {
                return NotFound(new { message = "Không có bác sĩ nào trong phòng ban này." });
            }

            // Sử dụng AutoMapper để map dữ liệu từ Model sang DTO
            var doctorDtos = _mapper.Map<List<DoctorDto>>(doctors);

            return Ok(doctorDtos);
        }
        [HttpGet]
        public async Task<IActionResult> GetListDoctor(int seId)
        {
            if (seId == null)
            {
                var listDoc = _alo2Context.Doctors.Where(x => x.IsActive == true).ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);
                return Ok(list);
            }
            else
            {
                var listDoc = _alo2Context.Doctors
             .Where(d => d.Services.Any(s => s.ServiceId == seId))
             .ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);

                return Ok(list);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetListAllSlot()
        {


            var listSlot = _alo2Context.Slots.ToList();
            if (listSlot.Count == 0)
            {
                return NotFound();
            }
            return Ok(listSlot);


        }
        [HttpGet]
        public async Task<IActionResult> GetListService(int deId)
        {
            if (deId == null)
            {
                var listDoc = _alo2Context.Services.Where(x => x.IsActive == true).ToList();
                var list = _mapper.Map<List<DoctorAppointment>>(listDoc);
                return Ok(list);
            }
            else
            {
                var listDoc = _alo2Context.Services.Where(x => x.IsActive == true).Where(x => x.DepId == deId).ToList();
                var list = _mapper.Map<List<ServiceAppointment>>(listDoc);

                return Ok(list);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetListDepartment()
        {
            var listDe = _alo2Context.Departments.Where(x => x.IsActive == true).ToList();
            var list = _mapper.Map<List<DepartmentAppointment>>(listDe);
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> GetListSlot(int docid, [FromBody] DateTimeDto date)
        {
            var s = _alo2Context.Schedules.Include(x => x.Doctor).FirstOrDefault(x => x.DoctorId == docid && x.Date == date.Date);
            if (s == null) return NotFound(new { message = "Không tìm lịch làm việc." });

            List<Slot> sl = null;

            // Determine which slots to consider based on the schedule's shift availability
            if (s.Morning == true && s.Afternoon == true)
            {
                sl = _alo2Context.Slots.ToList();
            }
            else if (s.Morning == false && s.Afternoon == true)
            {
                sl = _alo2Context.Slots.Where(x => x.Shift == 2).ToList();
            }
            else if (s.Morning == true && s.Afternoon == false)
            {
                sl = _alo2Context.Slots.Where(x => x.Shift == 1).ToList();
            }
            else
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu slot." });
            }

            // Create a list to store slots that should be removed
            var slotsToRemove = new List<Slot>();

            foreach (var slot in sl)
            {
                var appointments = _alo2Context.Appointments
              .Where(x => x.ScheduleId == s.Id && x.SlotId == slot.SlotId && x.Status == "Đã phê duyệt")
              .ToList();
                if (appointments.Count == 3)
                {
                    slotsToRemove.Add(slot); // Mark the slot for removal
                }
            }

            // Remove the marked slots after iteration
            sl.RemoveAll(slot => slotsToRemove.Contains(slot));

            return Ok(sl);
        }

        [HttpGet]
        public async Task<IActionResult> GetPatientsWithAppointmentsToday()
        {
            try
            {
                var today = DateTime.Today;

                var patientsWithAppointments = await _alo2Context.Patients
                    .Include(p => p.Appointments)
                    .Where(p => p.Appointments.Any(a => a.Date.Date == today))
                    .ToListAsync();

                if (!patientsWithAppointments.Any())
                {
                    return NotFound("No patients found with appointments today.");
                }

                // Trả về trực tiếp danh sách bệnh nhân với lịch hẹn của họ
                return Ok(patientsWithAppointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving patients: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetListDate(int docid)
        {
            var s = _alo2Context.Schedules.Include(x => x.Doctor).Where(x => x.DoctorId == docid).ToList();
            var d = _mapper.Map<List<DateAppointment>>(s);
            return Ok(d);
        }
        [HttpPut]
        public async Task<IActionResult> CancelAppointment(int aid)
        {
            Models.Appointment app = _alo2Context.Appointments.FirstOrDefault(x => x.Id == aid);
            if (app.Status == "Đang chờ phê duyệt")
            {
                _alo2Context.Appointments.Remove(app);
                await _alo2Context.SaveChangesAsync();
            }
            else if (app.Status == "Đã phê duyệt")
            {
                app.Status = "Đã hủy";
                await _alo2Context.SaveChangesAsync();
            }
            return Ok(app);
        }


    }
}
