using BE.DTOs.DepartmentDto;
using BE.DTOs.ServiceDto;

namespace BE.DTOs.DoctorDto
{
    public class DoctorMarketing
    {
        public int DocId { get; set; }
        public string Name { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public int Age { get; set; }
        public string? Img { get; set; }
        public string? Description { get; set; }
        public string? Email { get; set; } // Email của bác sĩ

        public DepartmentDTO Department { get; set; } = null!;
        public List<ServiceDTO> Services { get; set; } = new List<ServiceDTO>();
    }
    public class DoctorDto
    {
        public int DocId { get; set; }
        public string Name { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public int Age { get; set; }
        public bool? IsActive { get; set; }
        public string? Img { get; set; }
        public string? Description { get; set; }
        public int DepId { get; set; }
    }
}
