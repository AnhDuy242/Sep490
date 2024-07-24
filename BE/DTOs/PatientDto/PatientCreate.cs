namespace BE.DTOs.PatientDto
{
    public class PatientCreate
    {
        public int PatientId { get; set; }

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public string? Address { get; set; }

        public DateTime Dob { get; set; }

        public bool? IsActive { get; set; }

        public int? Check { get; set; }
    }
}
