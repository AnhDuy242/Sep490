
using AutoMapper;
using BE.DTOs.ConversationDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
    public async Task<IActionResult> Create([FromBody] CreateConversationDto createConversationDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var conversation = _mapper.Map<Conversation>(createConversationDto);
        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();

        var result = _mapper.Map<ConversationDto>(conversation);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
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

}
