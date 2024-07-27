namespace BE.DTOs.ConversationDto
{
    public class ConversationDto
    {
        public int Id { get; set; }
        public string DoctorId { get; set; }
        public string PatientId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateConversationDto
    {
        public string DoctorId { get; set; }
        public string PatientId { get; set; }
    }

    public class UpdateConversationDto
    {
        public int Id { get; set; }
        public string DoctorId { get; set; }
        public string PatientId { get; set; }
    }
}