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

        [HttpPost]
        public async Task<IActionResult> CreateMedicalNoteBook([FromForm] MedicalNoteBookCreate medicalNoteBookCreate, IFormFile file)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Create MedicalNotebook
                    var medicalNoteBook = new MedicalNotebook()
                    {
                        Prescription = medicalNoteBookCreate.Prescription,
                        Diagnostic = medicalNoteBookCreate.Diagnostic,
                        DoctorId = medicalNoteBookCreate.DoctorId,
                        PatientId = medicalNoteBookCreate.PatientId,
                        DateCreate = medicalNoteBookCreate.DateCreate,
                    };

                    _context.MedicalNotebooks.Add(medicalNoteBook);
                    await _context.SaveChangesAsync();

                    // Handle file upload if present
                    if (file != null && file.Length > 0)
                    {
                        var filePath = Path.GetTempFileName();
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var uploadResult = await _cloudinaryService.UploadImageAsync(filePath);
                        if (uploadResult == null)
                        {
                            throw new Exception("Error uploading file to Cloudinary.");
                        }

                        var testResult = new TestResult
                        {
                            ImgUrl = uploadResult.Url.ToString(),
                            MId = medicalNoteBook.Id
                        };

                        _context.TestResults.Add(testResult);
                        await _context.SaveChangesAsync();
                    }

                    transaction.Commit();
                    return Ok(new { MedicalNotebook = medicalNoteBook, Message = "Medical notebook created successfully" });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, $"An error occurred while creating the medical notebook: {ex.Message}");
                }
            }
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalNotebookDto>>> GetAllMedicalNotebooksWithTestResults()
        {
            var medicalNotebooks = await _context.MedicalNotebooks
                .Include(m => m.TestResults)
                .Include(m => m.Doctor)  // Include Doctor entity
                .Include(m => m.Patient) // Include Patient entity
                .Select(m => new MedicalNotebookDto
                {
                    Id = m.Id,
                    Prescription = m.Prescription,
                    Diagnostic = m.Diagnostic,
                    DateCreate = m.DateCreate,
                    DoctorName = m.Doctor.Name,   // Get Doctor's Name
                    DoctorId=m.DoctorId,
                    PatientId= m.PatientId,
                    PatientName = m.Patient.Name, // Get Patient's Name
                    TestResults = m.TestResults.Select(tr => new TestResultDto
                    {
                        ImgId = tr.ImgId,
                        ImgUrl = tr.ImgUrl
                    }).ToList()
                })
                .ToListAsync();

            return Ok(medicalNotebooks);
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
        [HttpDelete]
        public async Task<IActionResult> RemoveTestResult(int testResultId)
        {
            // Find the TestResult by its ID
            var testResult = await _context.TestResults.FindAsync(testResultId);

            if (testResult == null)
            {
                return NotFound("Không tìm thấy kết quả này.");
            }

            // Remove the TestResult
            _context.TestResults.Remove(testResult);

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
                return Ok("Đã gỡ thành công kết quả bệnh án này.");
            }
            catch (Exception ex)
            {
                // Handle errors (e.g., log the exception if necessary)
                return StatusCode(500, "Đã có lỗi xảy ra khi gỡ kết quả bệnh án này.");
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
