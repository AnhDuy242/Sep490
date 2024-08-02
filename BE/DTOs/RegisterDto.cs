namespace BE.DTOs
{
    public class RegisterDto
    {
        public string Name { get; set; } = null!;

        public string? Email { get; set; }

        public string Password { get; set; } = null!;
      

        public string Gender { get; set; } = null!;

        public string? Address { get; set; }

        public DateTime Dob { get; set; }
    }
}
