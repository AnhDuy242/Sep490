namespace BE.Models
{
    public class Conversation
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Conversation_Name { get; set; }

        // Navigation property
        public virtual ICollection<Message> Messages { get; set; }
    }
}
