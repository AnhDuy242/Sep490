using BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace BE.Controllers.Online_Consulting
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        public ChatController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }


        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
        {
            if (message == null || string.IsNullOrEmpty(message.User) || string.IsNullOrEmpty(message.Text))
            {
                return BadRequest("Invalid message.");
            }

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message.User, message.Text);

            return Ok(new { Status = "Message sent successfully." });
        }
    }
}
