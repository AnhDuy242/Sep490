using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Department
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Doctor> Doctors { get; } = new List<Doctor>();

    public virtual ICollection<Service> Services { get; } = new List<Service>();
}
