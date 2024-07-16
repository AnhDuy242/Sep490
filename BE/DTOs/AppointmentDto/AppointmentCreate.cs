namespace BE.DTOs.AppointmentDto
{
    public class AppointmentCreate
    {
        //  public int Id { get; set; }

        public int PatientId { get; set; }

        public int DoctorId { get; set; }

        public DateTime Date { get; set; }

        public int SlotId { get; set; }


       
    }
}
