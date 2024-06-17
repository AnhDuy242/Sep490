using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Schedule
{
    public int Id { get; set; }

    public int DoctorId { get; set; }

    public string Shift { get; set; } = null!;

    public int Weekdays { get; set; }

    public int WeekId { get; set; }

    public int Appoinments { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;

    public virtual Week Week { get; set; } = null!;
}
