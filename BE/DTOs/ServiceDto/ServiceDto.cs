using BE.DTOs.ServiceDto.BE.DTOs;

namespace BE.DTOs.ServiceDto
{
    public class ServiceDTO
    {
        public int ServiceId { get; set; }
        public string Name { get; set; } = null!;
        public int DepId { get; set; }
        public decimal Price { get; set; }
        public bool? IsActive { get; set; }
        public List<ServiceDetailDto> ServiceDetails { get; set; } = new List<ServiceDetailDto>();

    }
}
