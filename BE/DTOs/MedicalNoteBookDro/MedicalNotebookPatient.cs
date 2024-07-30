namespace BE.DTOs.MedicalNoteBookDro
{
    public class MedicalNotebookPatient
    {
        public int Id { get; set; }

        public string Prescription { get; set; } = null!;

        public string Diagnostic { get; set; } = null!;


        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set;}
        public DateTime? DateCreate { get; set; }

    }
}
