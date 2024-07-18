namespace BE.DTOs.MedicalNoteBookDro
{
    public class MedicalNotebookPatient
    {
        public string Prescription { get; set; } = null!;

        public string Diagnostic { get; set; } = null!;

        public string? TestResult { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set;}
    }
}
