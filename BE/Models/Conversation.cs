namespace BE.Models
{
    public class Conversation
    {
        public int Id { get; set; }
        public string DoctorId { get; set; }
        public string PatientId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation property
        public virtual ICollection<Message> Messages { get; set; }
    }
}
