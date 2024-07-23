namespace BE.DTOs.QuestionDto
{
    public class QuestionView
    {
        public int QuesId { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public string Question1 { get; set; } = null!;

        public DateTime QuesDate { get; set; }

        public int? DepId { get; set; }
        public string DepartmentName { get; set; }

        public int? DocId { get; set; }
        public string DoctorName { get; set; }

        public DateTime? AnsDate { get; set; }

        public string? Answer { get; set; }
    }
}
