using BE.Models;
using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.PatientDto
{
    public class PatientCreate
    {
        public int PatientId { get; set; }

        public string Name { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public string? Address { get; set; }

        public DateTime Dob { get; set; }

        public bool? IsActive { get; set; }

        public int? Check { get; set; }
    }

    public class PatientWithAppointmentsDto
    {
        public int AccId { get; set; }
        public string Phone { get; set; } = null!;
        public string? Email { get; set; }
        public string Password { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public int? Check { get; set; }

        public DateTime Dob { get; set; }
        public bool? IsActive { get; set; }
        public int RoleId { get; set; }

        public List<AppointmentReceptionistDto> Appointments { get; set; } = new List<AppointmentReceptionistDto>();
    }
    public class AppointmentReceptionistDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public int? DoctorId { get; set; }
        [JsonConverter(typeof(DateTimeJsonConverter))]
        public DateTime Date { get; set; }
        public int SlotId { get; set; }
        public string Status { get; set; } = null!;
        public string? Note { get; set; }
        public int? Check { get; set; }

        public int? ServiceId { get; set; }
        public string? ServiceName { get; set; } // Add ServiceName field
        public int? ScheduleId { get; set; }
    }
    public class PatientUpdateCheckDto
    {
        public int Check { get; set; }
    }

}
