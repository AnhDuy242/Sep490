namespace BE.DTOs.ScheduleDto
{
    public class ScheduleDoctor
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }

        public string Name { get; set; }
        public bool Morning { get; set; }

        public bool Afternoon { get; set; }

        public string Weekdays { get; set; } = null!;

        public DateTime Date { get; set; }

        public int? Appointments { get; set; }

    }
}
