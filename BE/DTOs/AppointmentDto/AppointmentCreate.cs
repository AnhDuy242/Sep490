using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.AppointmentDto
{
    public class AppointmentCreate
    {
        //  public int Id { get; set; }

        public int PatientId { get; set; }

        public int? DoctorId { get; set; }
        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime Date { get; set; }

        public int SlotId { get; set; }
        public int DepartmentId { get; set; }
        public int ServiceId { get; set; }



    }
}
