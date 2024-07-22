using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Department
{
    public int DepId { get; set; }

    public string? Name { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
}
