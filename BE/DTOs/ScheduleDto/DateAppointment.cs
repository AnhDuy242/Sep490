using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.ScheduleDto
{
    public class DateAppointment
    {
        [JsonConverter(typeof(DateOnlyJsonConverter))]

        public DateTime Date { get; set; }

    }
}
