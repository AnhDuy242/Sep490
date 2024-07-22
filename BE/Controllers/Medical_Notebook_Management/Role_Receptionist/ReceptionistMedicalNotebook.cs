using AutoMapper;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Medical_Notebook_Management.Role_Receptionist
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistMedicalNotebook : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public ReceptionistMedicalNotebook(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //[HttpPut]
        //public async Task<IActionResult> CreateMedicalNoteBook(int mid, string rs)
        //{
        //    var m = _context.MedicalNotebooks.FirstOrDefault(x => x.Id == mid);
        //    m.TestResult = rs;
        //    await _context.SaveChangesAsync();
        //    return Ok(m);
        //}
    }
}
