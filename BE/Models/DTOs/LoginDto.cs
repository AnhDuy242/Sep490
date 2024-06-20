namespace BE.Models.DTOs
{
    public class LoginDto
    {
        public string Identifier { get; set; } // Email or Phone
        public string Password { get; set; }
    }
}
