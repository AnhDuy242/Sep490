using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.ScheduleDto
{
    public class DateAppointment
    {
        public int Id { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime Date { get; set; }

    }
}
