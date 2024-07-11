using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Department
{
    public int DepId { get; set; }

    public string? Name { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Doctor> Doctors { get; } = new List<Doctor>();

    public virtual ICollection<Service> Services { get; } = new List<Service>();
}
