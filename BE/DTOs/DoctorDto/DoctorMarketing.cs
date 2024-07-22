namespace BE.DTOs.DoctorDto
{
    public class DoctorMarketing
    {
        public int DocId { get; set; }

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public int Age { get; set; }

        public int ServiceId { get; set; }

        public string ServiceName { get; set; }
        public string DepartmentName { get; set; }

        public bool? IsActive { get; set; }

    }
}
