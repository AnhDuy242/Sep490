namespace BE.DTOs
{
    public class AppointmentDto
    {
      //  public int Id { get; set; }

        public int PatientId { get; set; }

        public int DoctorId { get; set; }

        public DateTime Date { get; set; }

        public int SlotId { get; set; }


        public string? Note { get; set; }
    }
}
