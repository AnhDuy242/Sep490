using AutoMapper;
using BE.DTOs.FeedbackDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Feedback.Role_Receptionist
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistFeedbackController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public ReceptionistFeedbackController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<IActionResult> ResponseFeedback(int fId,int reId, string content)
        {
            FeedbackRe feedbackRe = new FeedbackRe()
            {
                Content = content,
                FeedId = fId,
                Date = DateTime.Now,
                RecepId = reId
            };
            _context.FeedbackRes.Add(feedbackRe);
            _context.SaveChanges();
            return Ok(feedbackRe);
        }

    }
}
