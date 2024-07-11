namespace BE.DTOs
{
    public class ReceptionistAccount
    {
        public int AccId { get; set; }
        public string? Email { get; set; }

        public string Phone { get; set; } = null!;

        public string Password { get; set; } = null!;
        public int? RoleId { get; set; }
        public bool? IsActive { get; set; }
        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;
        public DateTime Dob { get; set; }


    }
}
