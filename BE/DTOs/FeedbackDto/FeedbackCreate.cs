namespace BE.DTOs.FeedbackDto
{
    public class FeedbackCreate
    {
        public int FeedId { get; set; }

        public int PatientId { get; set; }

        public string? Content { get; set; }


        public int? Star { get; set; }
    }
}
