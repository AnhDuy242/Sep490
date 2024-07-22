using AutoMapper;
using BE.DTOs.FeedbackDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Feedback.Role_Patient
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FeedBackController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper; 
        public FeedBackController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] FeedbackCreate feedbackCreate)
        {
            var f = new Models.Feedback()
            {
                Content = feedbackCreate.Content,
                Date = DateTime.Now,
                PatientId = feedbackCreate.PatientId,
                Star = feedbackCreate.Star,
            };
            _context.Feedbacks.Add(f);
            _context.SaveChanges();
            return Ok(f);

        }
    }
}
