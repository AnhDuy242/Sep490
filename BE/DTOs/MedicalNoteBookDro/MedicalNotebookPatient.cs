namespace BE.DTOs.MedicalNoteBookDro
{
    public class MedicalNotebookPatient
    {
        public int Id { get; set; }

        public string Prescription { get; set; } = null!;

        public string Diagnostic { get; set; } = null!;


        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime Dob { get; set; }

        public bool? IsActive { get; set; }

        public int? Check { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set;}
        public DateTime? DateCreate { get; set; }

    }
    public class MedicalNotebookDto
    {
        public int Id { get; set; }
        public string Prescription { get; set; } = null!;
        public string Diagnostic { get; set; } = null!;
        public DateTime? DateCreate { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime Dob { get; set; }

        public bool? IsActive { get; set; }

        public int? Check { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public List<TestResultDto> TestResults { get; set; } = new List<TestResultDto>();
    }

    public class TestResultDto
    {
        public int ImgId { get; set; }
        public string ImgUrl { get; set; } = null!;
    }
}
