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
                var m = _context.MedicalNotebooks.Include(x => x.Patient).Include(x => x.Doctor).Include(x => x.TestResults).FirstOrDefault(x => x.Id == mid);
                var p = _context.Patients.FirstOrDefault(x => x.PatientId == m.PatientId);
                var a = _context.Appointments.Where(x => x.PatientId == p.PatientId).FirstOrDefault(x => x.Date == DateTime.Now);
                if (a != null)
                {
                    a.Status = "Đã khám";
                    _context.Appointments.Update(a);
                }
                p.Check = 3;
                _context.Patients.Update(p);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex) { return BadRequest(ex); }
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
