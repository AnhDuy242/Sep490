using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Admin
{
    public int AdminId { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public DateTime Dob { get; set; }

    public bool? IsActive { get; set; }

    public virtual Account AdminNavigation { get; set; } = null!;
}
