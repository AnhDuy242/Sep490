using AutoMapper;
using BE.DTOs.DepartmentDto;
using BE.Models;
using BE.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Ocsp;

namespace BE.Controllers.Question_Management.Role_Doctor
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DoctorQuestionController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        private readonly IDoctorService _service;
        public DoctorQuestionController(MedPalContext context, IMapper mapper, IDoctorService doctorService)
        {
            _context = context;
            _mapper = mapper;
            _service = doctorService;
        }
        [HttpPost]
        public async Task<IActionResult> AnswerQuestion(int qid, string answer, int docId)
        {
            var a = _context.Questions.FirstOrDefault(x => x.QuesId == qid);
            a.Answer = answer;
            a.DocId = docId;
            a.AnsDate = DateTime.Now;
            _context.Questions.Update(a);
            _context.SaveChanges();
            return Ok(a);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuestion(int depid)
        {
            var q = _context.Questions.Where(x => x.DepId == depid).ToList();
            return Ok(q);
        }
        [HttpGet]
        public async Task<IActionResult> GetDepartment(int docid)
        {
            var q = _context.Doctors.FirstOrDefault(x => x.DocId == docid);
            var de = _context.Departments.FirstOrDefault(x => x.DepId == q.DepId);
            var d = _mapper.Map<DepartmentAppointment>(de);
            return Ok(d);
        }
    }
}
