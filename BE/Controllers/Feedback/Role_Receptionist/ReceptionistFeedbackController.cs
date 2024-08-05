using AutoMapper;
using BE.DTOs.FeedbackDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<IActionResult> ResponseFeedback(int fId, int reId,int pid, string content)
        {
            var feedbackRe = new FeedbackRe
            {
                Content = content,
                FeedId = fId,
                Date = DateTime.Now,
                RecepId = reId,
                PatientId=pid
                
            };
            _context.FeedbackRes.Add(feedbackRe);
            await _context.SaveChangesAsync();
            return Ok(feedbackRe);
        }
        [HttpPut("{fId}")]
        public async Task<IActionResult> MarkFeedbackAsReplied(int fId)
        {
            // Log the incoming ID
            Console.WriteLine($"MarkFeedbackAsReplied called with fId: {fId}");

            var feedback = await _context.Feedbacks.FindAsync(fId); // Corrected this line
            if (feedback == null)
            {
                return NotFound();
            }

            feedback.isReply = true;
            _context.Feedbacks.Update(feedback);
            await _context.SaveChangesAsync();

            return Ok(feedback);
        }
        [HttpGet("{feedbackId}")]
        public async Task<ActionResult<IEnumerable<FeedbackReDto>>> GetFeedbackResponses_2(int feedbackId)
        {
            var feedback = await _context.Feedbacks
                .Include(f => f.FeedbackRes)
                .FirstOrDefaultAsync(f => f.FeedId == feedbackId);

            if (feedback == null)
            {
                return NotFound();
            }

            var responseDtos = _mapper.Map<List<FeedbackReDto>>(feedback.FeedbackRes);
            return Ok(responseDtos);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<FeedbackReDto>>> GetFeedbackResponses(int id)
        {
            var feedback = await _context.Feedbacks
                .Include(f => f.FeedbackRes)
                .Include(f => f.Patient) // Include the Patient to get PatientName
                .FirstOrDefaultAsync(f => f.FeedId == id);

            if (feedback == null)
            {
                return NotFound();
            }

            var responses = feedback.FeedbackRes
                .Where(fr => !fr.RecepId.HasValue); // Filter responses where `RecepId` is null (assuming it represents not replied)

            // Adding PatientName to each FeedbackReDto
            var responseDtos = _mapper.Map<List<FeedbackReDto>>(responses);
            responseDtos.ForEach(r => r.PatientName = feedback.Patient.Name);

            return Ok(responseDtos);
        }

        [HttpGet("unreplied")]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetUnrepliedFeedbacks()
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.Patient) // Include the Patient to get PatientName
                .Where(f => !f.isReply) // Filter feedback where isReply is false
                .ToListAsync();

            var feedbackDtos = _mapper.Map<List<FeedbackDto>>(feedbacks);

            return Ok(feedbackDtos);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetFeedbacks()
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.FeedbackRes)
                .Include(f => f.Patient) // Include the Patient to get PatientName
                .ToListAsync();

            var feedbackDtos = _mapper.Map<List<FeedbackDto>>(feedbacks);

            return Ok(feedbackDtos);
        }

        [HttpGet("star")]
        public async Task<ActionResult<IEnumerable<FeedbackDto>>> GetFeedbacksByStar([FromQuery] int star)
        {
            var feedbacks = await _context.Feedbacks
                .Where(f => f.Star == star)
                .Include(f => f.FeedbackRes) // Optionally include related data
                .Include(f => f.Patient) // Include the Patient to get PatientName
                .ToListAsync();

            var feedbackDtos = _mapper.Map<List<FeedbackDto>>(feedbacks);

            return Ok(feedbackDtos);
        }
    }
}
