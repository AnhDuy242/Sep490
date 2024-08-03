namespace BE.DTOs.EmployeeDto
{
    public class DoctorDto
    {
        public int AccId { get; set; }
        public string? Email { get; set; }

        public string Phone { get; set; } = null!;

        public string? Password { get; set; } = null!;
        public int? RoleId { get; set; }

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public int Age { get; set; }
        public string? Img { get; set; }
        public string? Description { get; set; }

        public string? DepartmentName { get; set; } = null!;
        public int DepId { get; set; }
        public bool? IsActive { get; set; }

    }

    public class ReceptionistDto
    {
        public int AccId { get; set; }
        public string? Email { get; set; }

        public string Phone { get; set; } = null!;

        public string? Password { get; set; } = null!;
        public int? RoleId { get; set; }
        public bool? IsActive { get; set; }
        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;
        public DateTime Dob { get; set; }

    }
}
