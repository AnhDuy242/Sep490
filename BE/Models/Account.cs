using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Account
{
    public string? Email { get; set; }

    public string Phone { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int? RoleId { get; set; }

    public virtual Role? Role { get; set; }
}
