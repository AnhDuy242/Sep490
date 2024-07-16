namespace BE.DTOs.AppointmentDto
{
    public class AppointmentPatient
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; }

        public DateTime Date { get; set; }

        public int SlotId { get; set; }
        public string Time { get; set; } = null!;

        public string Status { get; set; } = null!;

        public string? Note { get; set; }
    }
}
