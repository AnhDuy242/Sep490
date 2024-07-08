using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Appointment
{
    public int Id { get; set; }

    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public DateTime Date { get; set; }

    public int SlotId { get; set; }

    public string Status { get; set; } = null!;

    public string? Note { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;

    public virtual Slot Slot { get; set; } = null!;
}
