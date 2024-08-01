namespace BE.DTOs
{
    public class AccountDoctor
    {
        public int AccId { get; set; }
        public string? Email { get; set; }

        public string Phone { get; set; } = null!;

        public string Password { get; set; } = null!;
        public int? RoleId { get; set; }

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public int Age { get; set; }

        public string? DepartmentName { get; set; } = null!;
        public int DepId { get; set; }
        public bool? IsActive { get; set; }

    }
    public class UpdateDoctorAndAccountDto
    {
        public string? Img { get; set; }
        public string? Description { get; set; }

        public string? AccountPhone { get; set; }
        public string? AccountEmail { get; set; }
        public string? AccountPassword { get; set; }
    }
}