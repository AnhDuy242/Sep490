using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Service
{
    public int ServiceId { get; set; }

    public string Name { get; set; } = null!;

    public int DepId { get; set; }

    public decimal Price { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual Department Dep { get; set; } = null!;

    public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
}
