namespace BE.DTOs.MedicalNoteBookDro
{
    public class MedicalNoteBookCreate
    {
       

        public string Prescription { get; set; } = null!;

        public string Diagnostic { get; set; } = null!;

      

        public int PatientId { get; set; }

        public int DoctorId { get; set; }
    }
}
