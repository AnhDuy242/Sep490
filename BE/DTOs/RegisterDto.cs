namespace BE.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public DateTime Dob { get; set; }
        public string Gender { get; set; } = null!;
    }
}
