namespace BE.DTOs.PatientDto
{
    public class PatientReceptionist
    {
        public int PatientId { get; set; }

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public string? Address { get; set; }

        public DateTime Dob { get; set; }

        public bool? IsActive { get; set; }

        public int? Check { get; set; }
        public string Phone { get; set; } = null!;

        public string? Email { get; set; }

        public string Password { get; set; } = null!;
    
        public int RoleId { get; set; }

    }
}
