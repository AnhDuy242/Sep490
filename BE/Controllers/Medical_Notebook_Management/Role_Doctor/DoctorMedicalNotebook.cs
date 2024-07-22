using AutoMapper;
using BE.DTOs.MedicalNoteBookDro;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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



    }
}
