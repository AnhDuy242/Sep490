using BE.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.DTOs.ServiceDto
{
    namespace BE.DTOs
    {
        public class ServiceDetailDto
        {
            public int ServiceDetailId { get; set; } // Primary key

            public int ServiceId { get; set; } // Foreign key

            public string? Description { get; set; } // Detailed description of the service

            public int? Duration { get; set; } // Duration of the service in minutes

            public string? AdditionalInfo { get; set; } // Any additional information about the service

            public bool IsActive { get; set; } // Status of the service detail

            public string? ServiceName { get; set; }
        }
    }

}
