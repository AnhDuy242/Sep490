
using AutoMapper;
using BE.DTOs.ConversationDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

[Route("api/[controller]/[action]")]
[ApiController]
public class ConversationsController : ControllerBase
{
    private readonly MedPalContext _context;
    private readonly IMapper _mapper;

    public ConversationsController(MedPalContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/conversations/getall
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

    // GET: api/conversations/get/{id}
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

    // POST: api/conversations/create
    [HttpPost]
    public async Task<IActionResult> CreateIfNotExist([FromBody] CreateConversationDto createConversationDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if a conversation already exists for the given DoctorId and PatientId
        var existingConversation = await _context.Conversations
            .FirstOrDefaultAsync(c => c.DoctorId == createConversationDto.DoctorId && c.PatientId == createConversationDto.PatientId);

        if (existingConversation != null)
        {
            // If a conversation already exists, return the existing conversation
            var result = _mapper.Map<ConversationDto>(existingConversation);
            return Ok(result); // You might want to use `Ok` instead of `CreatedAtAction` here
        }

        // Create a new conversation if none exists
        var conversation = _mapper.Map<Conversation>(createConversationDto);
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();

        var newResult = _mapper.Map<ConversationDto>(conversation);
        return CreatedAtAction(nameof(GetById), new { id = newResult.Id }, newResult);
    }

    // PUT: api/conversations/update/{id}
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

    // DELETE: api/conversations/delete/{id}
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
    [HttpGet("getbydoctor/{doctorId}")]
    public async Task<IActionResult> GetByDoctorId(int doctorId)
    {
        var conversations = await _context.Conversations
            .Where(c => c.DoctorId == doctorId)
            .ToListAsync();

        if (conversations == null || !conversations.Any())
        {
            return NotFound();
        }

        var result = _mapper.Map<List<ConversationDto>>(conversations);
        return Ok(result);
    }
    [HttpGet("")]
    public async Task<IActionResult> GetByDoctorIdAndPatientID([FromQuery]int doctorId,  int patientId)
    {
        var conversations = await _context.Conversations
            .Where(c => c.DoctorId == doctorId && c.PatientId == patientId)
            .ToListAsync();

        if (conversations == null || !conversations.Any())
        {
            return NotFound();
        }

        var result = _mapper.Map<List<ConversationDto>>(conversations);
        return Ok(result);
    }
    [HttpGet("patientname/{patientId}")]
    public async Task<IActionResult> GetPatientName(int patientId)
    {
        // Find the patient by their ID
        var patient = await _context.Patients
            .Where(p => p.PatientId == patientId)
            .Select(p => p.Name)
            .FirstOrDefaultAsync();

        if (patient == null)
        {
            return NotFound(); // Return 404 if the patient is not found
        }

        return Ok(patient); // Return the patient's name
    }

    [HttpGet("{doctorId}")]
    public async Task<IActionResult> GetDoctorName(int doctorId)
    {
        var doctor = await _context.Doctors
            .Where(d => d.DocId == doctorId)
            .Select(d => new { d.Name })
            .FirstOrDefaultAsync();

        if (doctor == null)
        {
            return NotFound();
        }

        return Ok(doctor.Name);
    }
}

