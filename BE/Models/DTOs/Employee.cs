namespace BE.Models.DTOs
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public int Age { get; set; }

        public string Phone { get; set; } = null!;

        public DateTime Dob { get; set; }

        public string Role { get; set; }
    }
}
