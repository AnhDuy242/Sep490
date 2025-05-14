using AutoMapper;
using BE.DTOs.FeedbackDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Feedback.Role_Patient
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PatientFeedbackController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper; 
        public PatientFeedbackController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFeedback()
        {
            var list = await _context.Feedbacks.Include(x => x.Patient).ToListAsync();
            var l = _mapper.Map<List<FeedbackView>>(list);
            return Ok(l);

        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] FeedbackCreate feedbackCreate, int pid)
        {
            var f = new Models.Feedback()
            {
                Content = feedbackCreate.Content,
                Date = DateTime.Now,
                PatientId = pid,
                Star = feedbackCreate.Star,
            };
            await _context.Feedbacks.AddAsync(f);
            var p = await _context.Patients.FirstOrDefaultAsync(x => x.PatientId == pid);
            p.Check = 0;
            _context.Patients.Update(p);
            await _context.SaveChangesAsync();
            return Ok(f);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateFeedback(int fid, string content)
        {
            var f = await _context.Feedbacks.FirstOrDefaultAsync(x => x.FeedId == fid);
            f.Content = content;
            _context.Feedbacks.Update(f);
            await _context.SaveChangesAsync();
            return Ok(f);

        }
    }
}
