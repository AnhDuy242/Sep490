using AutoMapper;
using BE.DTOs.ConversationDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Customer_Care_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReceptionistConversationsController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public ReceptionistConversationsController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/receptionistconversations/getall
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var conversations = await _context.Conversations.ToListAsync();
            if (conversations == null || !conversations.Any())
            {
                return NotFound();
            }
            var result = _mapper.Map<List<ConversationDto>>(conversations);
            return Ok(result);
        }

        // GET: api/receptionistconversations/get/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var conversation = await _context.Conversations.FindAsync(id);
            if (conversation == null)
            {
                return NotFound();
            }
            var result = _mapper.Map<ConversationDto>(conversation);
            return Ok(result);
        }

        // POST: api/receptionistconversations/create
        [HttpPost]
        public async Task<IActionResult> CreateIfNotExist([FromBody] CreateConversationDto createConversationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if a conversation already exists for the given ReceptionistId and PatientId
            var existingConversation = await _context.Conversations
                .FirstOrDefaultAsync(c => c.DoctorId == createConversationDto.DoctorId && c.PatientId == createConversationDto.PatientId);

            if (existingConversation != null)
            {
                // If a conversation already exists, return the existing conversation
                var result = _mapper.Map<ConversationDto>(existingConversation);
                return Ok(result); // Use `Ok` to return the existing conversation
            }

            // Create a new conversation if none exists
            var conversation = _mapper.Map<Conversation>(createConversationDto);
            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            var newResult = _mapper.Map<ConversationDto>(conversation);
            return CreatedAtAction(nameof(GetById), new { id = newResult.Id }, newResult);
        }

        // PUT: api/receptionistconversations/update/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateConversationDto updateConversationDto)
        {
            if (id != updateConversationDto.Id)
            {
                return BadRequest();
            }

            var conversation = await _context.Conversations.FindAsync(id);
            if (conversation == null)
            {
                return NotFound();
            }

            _mapper.Map(updateConversationDto, conversation);
            _context.Entry(conversation).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/receptionistconversations/delete/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var conversation = await _context.Conversations.FindAsync(id);
            if (conversation == null)
            {
                return NotFound();
            }

            _context.Conversations.Remove(conversation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/receptionistconversations/getbyreceptionist/{receptionistId}
        [HttpGet("getbyreceptionist/{receptionistId}")]
        public async Task<IActionResult> GetByReceptionistId(int receptionistId)
        {
            var conversations = await _context.Conversations
                .Where(c => c.DoctorId == receptionistId)
                .ToListAsync();

            if (conversations == null || !conversations.Any())
            {
                return NotFound();
            }

            var result = _mapper.Map<List<ConversationDto>>(conversations);
            return Ok(result);
        }

        // GET: api/receptionistconversations?DoctorId={DoctorId}&patientId={patientId}
        [HttpGet("")]
        public async Task<IActionResult> GetByDoctorIdAndPatientId([FromQuery] int DoctorId, [FromQuery] int patientId)
        {
            var conversations = await _context.Conversations
                .Where(c => c.DoctorId == DoctorId && c.PatientId == patientId)
                .ToListAsync();

            if (conversations == null || !conversations.Any())
            {
                return NotFound();
            }

            var result = _mapper.Map<List<ConversationDto>>(conversations);
            return Ok(result);
        }

        // GET: api/receptionistconversations/patientname/{patientId}
        [HttpGet("/{patientId}")]
        public async Task<IActionResult> GetPatientName(int patientId)
        {
            var patient = await _context.Patients
                .Where(p => p.PatientId == patientId)
                .Select(p => p.Name)
                .FirstOrDefaultAsync();

            if (patient == null)
            {
                return NotFound();
            }

            return Ok(patient);
        }

        // GET: api/receptionistconversations/receptionistname/{DoctorId}
        [HttpGet("{DoctorId}")]
        public async Task<IActionResult> GetReceptionistName(int DoctorId)
        {
            var receptionist = await _context.Receptionists
                .Where(r => r.RecepId == DoctorId)
                .Select(r => r.Name)
                .FirstOrDefaultAsync();

            if (receptionist == null)
            {
                return NotFound();
            }

            return Ok(receptionist);
        }
    }
}
