namespace BE.DTOs
{
    public class ScheduleCreationModel
    {
        public int DoctorId { get; set; }
        public bool Morning { get; set; }
        public bool Afternoon { get; set; }
        public string Weekdays { get; set; } = null!;
        public DateTime Date { get; set; }
        public int WeekId { get; set; }
        public int? Appointments { get; set; }
    }
}
