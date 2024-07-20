using AutoMapper;
using BE.DTOs.MedicalNoteBookDro;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Medical_Notebook_Management.Role_Patient
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PatientMedicalNoteBook : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public PatientMedicalNoteBook(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetMedicalNotebookByPatientId(int pid)
        {
            var list = _context.MedicalNotebooks.Include(x => x.Patient).Include(x => x.Doctor).Where(x => x.PatientId == pid).ToList();
            var lists = _mapper.Map<List<MedicalNotebookPatient>>(list);
            return Ok(lists);
        }
    }
}
