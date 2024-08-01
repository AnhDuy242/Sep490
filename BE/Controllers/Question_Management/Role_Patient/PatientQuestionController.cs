using AutoMapper;
using BE.DTOs.QuestionDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Question_Management.Role_Patient
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class PatientQuestionController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public PatientQuestionController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost] 
        public async Task<IActionResult> CreateQuestion(int pid, string question, int depId)
        {
           var q = new Question()
           {
               PatientId = pid,
               QuesDate = DateTime.Now,
               DepId = depId,
               Question1 = question
           };
            _context.Questions.Add(q);
            _context.SaveChanges();
            return Ok(q);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateQuestion(int pid, string question)
        {
            var q = _context.Questions.FirstOrDefault(q => q.QuesId == pid);
            q.Question1 = question;
            _context.Questions.Update(q);
            _context.SaveChanges();
            return Ok(q);
        }
        [HttpGet]
        public async Task<IActionResult> GetQuestionByDepId(int depip)
        {
            var q = _context.Questions.Include(x => x.Doc).Include(x => x.Patient).Include(x => x.Dep).Where(x =>  x.DepId == depip).ToList();
            var qu = _mapper.Map<List<QuestionView>>(q);
            return Ok(qu);
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestionByPatientId(int patientId)
        {
            var q = _context.Questions.Include(x => x.Doc).Include(x => x.Patient).Include(x => x.Dep).Where(x => x.PatientId == patientId).ToList();
            var qu = _mapper.Map<List<QuestionView>>(q);
            return Ok(qu);
        }
    }
}
