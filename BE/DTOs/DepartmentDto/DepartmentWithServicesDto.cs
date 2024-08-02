using BE.DTOs.ServiceDto;

namespace BE.DTOs.DepartmentDto
{
    public class DepartmentWithServicesDto
    {
        public DepartmentDTO Department { get; set; }
        public List<ServiceDTO> Services { get; set; }
    }
}
