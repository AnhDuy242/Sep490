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

    public virtual Department Dep { get; set; } = null!;
}
