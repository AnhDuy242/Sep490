using AutoMapper;
using BE.DTOs.MedicalNoteBookDro;
using BE.DTOs.PatientDto;
using BE.Models;
using BE.Service.ImplService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace BE.Controllers.Medical_Notebook_Management.Role_Doctor
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DoctorMedicalNotebook : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        private readonly CloudinaryService _cloudinaryService;

        public DoctorMedicalNotebook(MedPalContext context, IMapper mapper, CloudinaryService cloudinaryService)
        {
            _context = context;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }


        [HttpPost]
        public async Task<IActionResult> CreateMedicalNoteBook([FromForm] MedicalNoteBookCreate medicalNoteBookCreate, IFormFile? file)
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
        public async Task<IActionResult> ViewAllMedicalNoteBooks()
        {
            var list = _context.MedicalNotebooks.ToList();
            return Ok(list);

        }
        [HttpGet]
        public async Task<IActionResult> ViewAllMedicalNoteBooks_2()
        {
            var list = await _context.MedicalNotebooks
                .Include(x => x.Patient)
                    .ThenInclude(p => p.PatientNavigation) // Include Patient's Account
                .Include(x => x.Doctor)
                    .ThenInclude(d => d.Doc) // Include Doctor's Account
                .ToListAsync();

            if (list.Count == 0)
            {
                return NotFound("Không tìm thấy hồ sơ bệnh án");
            }

            // Map to DTO with Phone included
            var lists = list.Select(m => new MedicalNotebookPatient2
            {
                Id = m.Id,
                Prescription=m.Prescription,
                Diagnostic=m.Diagnostic,
                PatientName = m.Patient.Name,
                DoctorName = m.Doctor.Name,
                PatientPhone = m.Patient.PatientNavigation.Phone
            }).ToList();

            return Ok(lists);
        }
       

        [HttpGet]
        public async Task<IActionResult> ViewMedicalNoteBookByPatientId(int pid)
        {
            var list = _context.MedicalNotebooks
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .Where(x => x.PatientId == pid)
                .ToList();

            if (list.Count == 0)
            {
                return NotFound("Không tìm thấy bệnh án với ID này");
            }

            var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
            return Ok(lists);
        }
        [HttpGet]
        public async Task<IActionResult> ViewMedicalNoteBookByMedicalId(int pid)
        {
            var list = _context.MedicalNotebooks
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .Where(x => x.Id == pid)
                .ToList();

            if (list.Count == 0)
            {
                return NotFound("Không tìm thấy bệnh án với ID này");
            }

            var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
            return Ok(lists);
        }
        [HttpGet]
        public async Task<IActionResult> ViewMedicalNoteBookByPatientName(string name)
        {
            var list = _context.MedicalNotebooks
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .Where(x => x.Patient.Name.Contains(name))
                .ToList();

            if (list.Count == 0)
            {
                return NotFound("Không tìm thấy bệnh án với tên bệnh nhân này");
            }

            var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
            return Ok(lists);
        }

        [HttpGet(template: "{id}")]
        public async Task<IActionResult> GetMedicalNoteBookById(int id)
        {
            var medicalNoteBook = await _context.MedicalNotebooks
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (medicalNoteBook == null)
            {
                return NotFound("Không tìm thấy bệnh án với ID này");
            }

            var result = _mapper.Map<MedicalNotebookPatient>(medicalNoteBook);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> ViewPatientActive()
        {
            try
            {
                var list = _context.Patients.Where(x => x.Check!=null).ToList();
                return Ok(list);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        public async Task<IActionResult> ViewOnlinePatient()
        {
            try
            {
                var list = _context.Patients.Where(x => x.Check ==1 ).ToList();
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPatient()
        {
            try
            {
                var list = _context.Patients.Include(x => x.PatientNavigation).Where(x=>x.Check!=null).ToList();
                var l = _mapper.Map<List<PatientReceptionist>>(list);
                return Ok(l);
            }
            catch (Exception ex)
            {
                return BadRequest(
                ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalNoteBook(int id, [FromBody] MedicalNoteBookUpdate updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var medicalNoteBook = await _context.MedicalNotebooks.FindAsync(id);

            if (medicalNoteBook == null)
            {
                return NotFound("Medical notebook not found");
            }
 
                medicalNoteBook.Prescription = updateDto.Prescription;
                medicalNoteBook.Diagnostic = updateDto.Diagnostic;
            


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicalNoteBookExists(id))
                {
                    return NotFound("Medical notebook not found");
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { Message = "Medical notebook updated successfully", MedicalNotebook = medicalNoteBook });
        }
        private bool MedicalNoteBookExists(int id)
        {
            return _context.MedicalNotebooks.Any(e => e.Id == id);
        }
    }


}

