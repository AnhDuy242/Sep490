using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.AppointmentDto
{
    public class AppointmentReceptionist
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime Date { get; set; }

        public int SlotId { get; set; }
        public string Time { get; set; } = null!;

        public string Status { get; set; } = null!;

        public string? Note { get; set; }
    }
}
