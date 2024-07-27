using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Slot
{
    public int SlotId { get; set; }

    public string Time { get; set; } = null!;

    public int? Shift { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
