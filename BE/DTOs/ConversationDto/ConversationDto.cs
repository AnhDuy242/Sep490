namespace BE.DTOs.ConversationDto
{
    public class ConversationDto
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Conversation_Name { get; set; }

    }

    public class CreateConversationDto
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Conversation_Name { get; set; }
    }

    public class UpdateConversationDto
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
    }
}