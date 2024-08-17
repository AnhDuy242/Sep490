using AutoMapper;
using BE.DTOs.MedicalNoteBookDro;
using BE.DTOs.PatientDto;
using BE.Models;
using BE.Service.ImplService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace BE.Controllers.Medical_Notebook_Management.Role_Receptionist
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistMedicalNotebook : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        private readonly CloudinaryService _cloudinaryService;
        public ReceptionistMedicalNotebook(MedPalContext context, IMapper mapper, CloudinaryService cloudinaryService)
        {
            _context = context;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }

        [HttpPut]
        public async Task<IActionResult> CreateMedicalNoteBook(int mid, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var filePath = Path.GetTempFileName();

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var uploadResult = await _cloudinaryService.UploadImageAsync(filePath);

            if (uploadResult == null)
            {
                return StatusCode(500, "Error uploading file to Cloudinary.");
            }

            var m = _context.MedicalNotebooks.FirstOrDefault(x => x.Id == mid);
            var testResult = new TestResult
            {
                ImgUrl = uploadResult.Url.ToString()
                // Set other properties of TestResult as necessary
            };
            m.TestResults.Add(testResult);
            await _context.SaveChangesAsync();
            return Ok(testResult);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllMedicalNoteBook()
        {
            var list = _context.MedicalNotebooks.Include(x => x.Patient).Include(x => x.Doctor).Include(x => x.TestResults).ToList();
            var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
            return Ok(lists);
        }
        [HttpPut()]
        public IActionResult MarkAppointmentAsCompleted(int patientId, int doctorId, DateTime date)
        {
            // Find the MedicalNotebook based on patientId and doctorId
            var medicalNotebook = _context.MedicalNotebooks
                .FirstOrDefault(mn => mn.PatientId == patientId && mn.DoctorId == doctorId && mn.DateCreate.Value.Date == date.Date);

            if (medicalNotebook == null)
            {
                return NotFound("Không tìm thấy MedicalNotebook với thông tin này.");
            }

            // Find the appointment that matches the criteria
            var appointment = _context.Appointments
                .FirstOrDefault(a => a.PatientId == patientId && a.DoctorId == doctorId && a.Date.Date == date.Date && a.Status != "Đã khám");

            if (appointment != null)
            {
                appointment.Status = "Đã khám";
                _context.SaveChanges();
                return Ok();
            }
            else
            {
                return NotFound("Không tìm thấy appointment này hoặc appointment đã được đánh dấu là 'Đã khám'");
            }
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }

        [HttpGet]
        public async Task<IActionResult> GetMedicalNoteBookByPatientId(int pid)
        {
            var list = _context.MedicalNotebooks.Include(x => x.Patient).Include(x => x.Doctor).Include(x => x.TestResults).Where(x => x.PatientId == pid).ToList();
            var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
            return Ok(lists);
        }
        [HttpGet]
        public async Task<IActionResult> GetTestResult(int mid)
        {
            var t = _context.TestResults.Where(x => x.MId == mid).ToList();
            return Ok(t);

        }


        [HttpPut]
        public async Task<IActionResult> SetOfflinePatientByMid(int mid)
        {
            try
            {
                var medicalNotebook = await _context.MedicalNotebooks
                    .Include(x => x.Patient)
                    .Include(x => x.Doctor)
                    .Include(x => x.TestResults)
                    .FirstOrDefaultAsync(x => x.PatientId == mid);

                if (medicalNotebook == null)
                {
                    return NotFound("Medical notebook not found.");
                }

                var patient = await _context.Patients
                    .FirstOrDefaultAsync(x => x.PatientId == medicalNotebook.PatientId);

                if (patient == null)
                {
                    return NotFound("Patient not found.");
                }

                var appointment = await _context.Appointments
                    .FirstOrDefaultAsync(x => x.PatientId == patient.PatientId && x.Date.Date == DateTime.Now.Date);

                if (appointment != null)
                {
                    appointment.Status = "Đã khám";
                    _context.Appointments.Update(appointment);
                }

                patient.Check = 3;
                _context.Patients.Update(patient);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception here if necessary
                return StatusCode(500, "Internal server error occurred.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> SetOnlinePatientByPid(int pid)
        {
            try
            {
                var p = _context.Patients.FirstOrDefault(x => x.PatientId == pid);
                p.Check = 1;
                _context.Patients.Update(p);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex) { return BadRequest(ex); }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPatient()
        {
            try
            {
                var list = _context.Patients.Include(x => x.PatientNavigation).ToList();
                var l = _mapper.Map<List<PatientReceptionist>>(list);
                return Ok(l);
            }
            catch (Exception ex)
            {
                return BadRequest(
                ex.Message);
            }
        }


        //[HttpGet]
        //public async Task<IActionResult> GetAllMedicalNoteBook()
        //{
        //    var list = _context.MedicalNotebooks.Include(x => x.Patient).Include(x => x.Doctor).ToList();
        //    var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
        //    return Ok(lists);
        //}

        //[HttpGet]
        //public async Task<IActionResult> GetMedicalNoteBookByPatientId(int pid)
        //{
        //    var list = _context.MedicalNotebooks.Include(x => x.Patient).Include(x => x.Doctor).Where(x => x.PatientId == pid).ToList();
        //    var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
        //    return Ok(lists);
        //}


    }
}
