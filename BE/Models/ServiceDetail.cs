using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models
{
    public class ServiceDetail
    {
        [Key]
        [Column("service_detail_id")]
        public int ServiceDetailId { get; set; } // Primary key

        [Column("service_id")]
        public int ServiceId { get; set; } // Foreign key

        [Column("description")]
        public string? Description { get; set; } // Detailed description of the service

        [Column("duration")]
        public int? Duration { get; set; } // Duration of the service in minutes

        [Column("additional_info")]
        public string? AdditionalInfo { get; set; } // Any additional information about the service

        [Column("isActive")]
        public bool IsActive { get; set; } // Status of the service detail

        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; } // Link to the Service entity
    }
}
