using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.AppointmentDto
{
    public class AppointmentDto
    {
        //  public int Id { get; set; }

        public int PatientId { get; set; }

        public int DoctorId { get; set; }
        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime Date { get; set; }

        public int SlotId { get; set; }


        public string? Note { get; set; }
    }
}
