using AutoMapper;
using BE.DTOs.MedicalNoteBookDro;
using BE.DTOs.PatientDto;
using BE.Models;
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
        public DoctorMedicalNotebook(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpPost]
        public async Task<IActionResult> CreateMedicalNoteBook([FromBody] MedicalNoteBookCreate medicalNoteBookCreate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            MedicalNotebook medicalNoteBook = new MedicalNotebook()
            {
                Prescription = medicalNoteBookCreate.Prescription,
                Diagnostic = medicalNoteBookCreate.Diagnostic,
                DoctorId = medicalNoteBookCreate.DoctorId,
                PatientId = medicalNoteBookCreate.PatientId,
            };
            _context.MedicalNotebooks.Add(medicalNoteBook);
            _context.SaveChanges();
            return Ok(medicalNoteBook);
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
                .Include(x => x.Doctor)
                .ToListAsync();

            if (list.Count == 0)
            {
                return NotFound("Không tìm thấy hồ sơ bệnh án");
            }

            var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
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

        [HttpGet("{id}")]
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



    }
}
