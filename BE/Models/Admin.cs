using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Admin
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public int Age { get; set; }
}
