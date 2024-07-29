namespace BE.DTOs.MessageDto
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string? MessageText { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
    }

    public class CreateMessageDto
    {
        public int ConversationId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string? MessageText { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime SentAt { get; set; }

    }

    public class UpdateMessageDto
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string? MessageText { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsRead { get; set; }
    }
}
