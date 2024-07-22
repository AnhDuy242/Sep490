namespace BE.DTOs.DoctorDto
{
    public class DoctorMarketing
    {
        public int DocId { get; set; }

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public int Age { get; set; }

        public bool? IsActive { get; set; }

        public string? Img { get; set; }

        public string? Description { get; set; }
        public string AllServiceName { get; set; }
        public string AllDepartmentName { get; set; }
    }
}
