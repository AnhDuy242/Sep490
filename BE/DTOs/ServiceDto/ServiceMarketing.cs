namespace BE.DTOs.ServiceDto
{
    public class ServiceMarketing
    {
        public int ServiceId { get; set; }

        public string Name { get; set; } = null!;

        public int DepId { get; set; }
        public string DepartmentName { get; set; }

        public decimal Price { get; set; }
    }
}
