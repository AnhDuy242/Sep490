namespace BE.DTOs
{
    public class ScheduleUpdateModel
    {
        public int DoctorId { get; set; }
        public bool Morning { get; set; }
        public bool Afternoon { get; set; }
        public string Weekdays { get; set; } = null!;
        public DateTime Date { get; set; }
        public int WeekId { get; set; }
        public int? Appointments { get; set; }
    }

    public class ScheduleCreationModel
    {
        public int DoctorId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? Appointments { get; set; }
        public List<bool> Morning { get; set; } = new List<bool>(); // 7 items for each day of the week
        public List<bool> Afternoon { get; set; } = new List<bool>(); // 7 items for each day of the week
    }

}
