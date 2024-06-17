using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Slot
{
    public int Id { get; set; }

    public string Time { get; set; } = null!;

    public virtual ICollection<Appointment> Appointments { get; } = new List<Appointment>();
}
