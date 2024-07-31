using AutoMapper;
using BE.Models;
using BE.DTOs.MessageDto; // Cập nhật namespace
using BE.DTOs.ConversationDto; // Cập nhật namespace
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Plugins;

namespace BE.Controllers.Customer_Care_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public MessagesController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/messages/getall
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var messages = await _context.Messages.ToListAsync();
            if (messages == null || !messages.Any())
            {
                return NotFound();
            }
            var result = _mapper.Map<List<MessageDto>>(messages);
            return Ok(result);
        }

        // GET: api/messages/get/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }
            var result = _mapper.Map<MessageDto>(message);
            return Ok(result);
        }

        // POST: api/messages/create
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMessageDto createMessageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var message = _mapper.Map<Models.Message>(createMessageDto);
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var result = _mapper.Map<MessageDto>(message);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // PUT: api/messages/update/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMessageDto updateMessageDto)
        {
            if (id != updateMessageDto.Id)
            {
                return BadRequest();
            }

            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _mapper.Map(updateMessageDto, message);
            _context.Entry(message).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/messages/delete/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/messages/getbyparticipant/{id}
        [HttpGet("getbyparticipant/{id}")]
        public async Task<IActionResult> GetByParticipantId(int id)
        {
            var messages = await _context.Messages
                .Where(m => m.SenderId == id || m.ReceiverId == id)
                .ToListAsync();

            if (messages == null || !messages.Any())
            {
                return NotFound();
            }

            var result = _mapper.Map<List<MessageDto>>(messages);
            return Ok(result);
        }
        [HttpGet("{conversationId}")]
        public async Task<IActionResult> GetAllMessagesByConversationId(int conversationId)
        {
            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .ToListAsync();

            if (messages == null || !messages.Any())
            {
                return NotFound();
            }

            var result = _mapper.Map<List<MessageDto>>(messages);
            return Ok(result);
        }
        [HttpGet("GetUnreadCount")]
        public async Task<IActionResult> GetUnreadCount([FromQuery] int receiverId, [FromQuery] int senderId)
        {
            Console.WriteLine(receiverId + "" + senderId);
            if (receiverId <= 0 || senderId <= 0)
            {
                return BadRequest("Invalid receiverId or conversationId");
            }

            var unreadCount = await _context.Messages   
                .CountAsync(m => m.ReceiverId == receiverId
                                 && m.SenderId == senderId
                                 && !m.IsRead);

            return Ok(unreadCount);
        }
        [HttpPatch("MarkMessagesAsRead")]
        public async Task<IActionResult> MarkMessagesAsRead([FromQuery] int senderid, [FromQuery] int receiverId)
        {
            if (senderid <= 0 || receiverId <= 0)
            {
                return BadRequest("Invalid conversationId or senderId.");
            }

            var messages = await _context.Messages
                .Where(m => m.SenderId == senderid && m.ReceiverId != receiverId && m.IsRead == false)
                .ToListAsync();

            if (messages.Count == 0)
            {
                return Ok("No unread messages found.");
            }

            foreach (var message in messages)
            {
                message.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok("Messages marked as read.");
        }

    }

}
