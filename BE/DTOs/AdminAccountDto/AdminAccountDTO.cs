namespace BE.DTOs.AdminAccountDto
{
    // AdminAccountDTO.cs
    public class AdminAccountDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Email { get; set; }
        public string Phone { get; set; }
        public bool? IsActive { get; set; }
        public string Password { get; set; }
    }

}
