using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Schedule
{
    public int Id { get; set; }

    public int DoctorId { get; set; }

    public bool Morning { get; set; }

    public bool Afternoon { get; set; }

    public string Weekdays { get; set; } = null!;

    public DateTime Date { get; set; }

    public int? Appointments { get; set; }

    public virtual ICollection<Appointment> AppointmentsNavigation { get; set; } = new List<Appointment>();

    public virtual Doctor Doctor { get; set; } = null!;
}
