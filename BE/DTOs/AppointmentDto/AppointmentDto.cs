using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.AppointmentDto
{
    public class AppointmentDto
    {
        //  public int Id { get; set; }

        public int PatientId { get; set; }

        public int DoctorId { get; set; }
        /*        [JsonConverter(typeof(DateOnlyJsonConverter))]
         *        
        */
        [JsonConverter(typeof(DateTimeJsonConverter))]

        public DateTime Date { get; set; }
        public string Status { get; set; } = null!;

        public int SlotId { get; set; }

        public int? Check { get; set; }

        public string? Note { get; set; }
    }
    public class AppointmentDetailDto
    {
        public int Id { get; set; }

        public int PatientId { get; set; }

        public int DoctorId { get; set; }
        /*        [JsonConverter(typeof(DateOnlyJsonConverter))]
        */
        [JsonConverter(typeof(DateTimeJsonConverter))]

        public DateTime Date { get; set; }

        public string Status { get; set; } = null!;

        public int SlotId { get; set; }
        public int? Check { get; set; }


        public string? Note { get; set; }
    }

    public class UpcomingAppointmentDetailDto
    {
        public int AppointmentId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string AppointmentStatus { get; set; }
        public string AppointmentNote { get; set; }
        public int AppointmentCheck { get; set; }

        public string PatientName { get; set; }
        public string PatientGender { get; set; }
        public DateTime PatientDob { get; set; }

        public string DoctorName { get; set; }
        public string DoctorGender { get; set; }
        public int DoctorAge { get; set; }
        public int DepartmentId { get; set; }

        public string SlotTime { get; set; }
        public int? ServiceId { get; set; }
        public int? ScheduleId { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime ScheduleDate { get; set; }
    }
}
