using Twilio.TwiML.Voice;

namespace BE.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string? MessageText { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }

        // Navigation property (optional)
        public virtual Conversation Conversation { get; set; }
    }
}
