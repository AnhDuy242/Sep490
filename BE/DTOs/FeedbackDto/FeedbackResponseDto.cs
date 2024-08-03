namespace BE.DTOs.FeedbackDto
{
    public class FeedbackDto
    {
        public int FeedId { get; set; }
        public int PatientId { get; set; }
        public string? PatientName { get; set; }  // Added PatientName
        public string? Content { get; set; }
        public DateTime Date { get; set; }
        public int? Star { get; set; }
        public bool IsReply { get; set; }
        public List<FeedbackReDto> FeedbackResponses { get; set; } = new List<FeedbackReDto>();
    }

    public class FeedbackReDto
    {
        public int ResId { get; set; }
        public int FeedId { get; set; }
        public int? RecepId { get; set; }
        public int? PatientId { get; set; }
        public string? PatientName { get; set; }  // Added PatientName
        public string Content { get; set; } = null!;
        public DateTime Date { get; set; }
    }
}
