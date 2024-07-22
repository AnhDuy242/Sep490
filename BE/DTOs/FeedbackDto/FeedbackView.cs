namespace BE.DTOs.FeedbackDto
{
    public class FeedbackView
    {
        public int FeedId { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public string? Content { get; set; }

        public DateTime Date { get; set; }

        public int? Star { get; set; }
    }
}
