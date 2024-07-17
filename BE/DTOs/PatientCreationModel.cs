namespace BE.DTOs
{
    public class PatientCreationModel
    {
        public int AccId { get; set; }

        public string Phone { get; set; } = null!;

        public string? Email { get; set; }

        public string Password { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public string? Address { get; set; }

        public DateTime Dob { get; set; }
        public int RoleId { get; set; }

        public bool? IsActive { get; set; }
    }
}
