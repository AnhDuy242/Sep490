using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Account
{
    public int AccId { get; set; }

    public string Phone { get; set; } = null!;

    public string? Email { get; set; }

    public string Password { get; set; } = null!;

    public int RoleId { get; set; }

    public bool? IsActive { get; set; }

    public virtual Admin? Admin { get; set; }

    public virtual ArticleManager? ArticleManager { get; set; }

    public virtual Doctor? Doctor { get; set; }

    public virtual Patient? Patient { get; set; }

    public virtual Receptionist? Receptionist { get; set; }

    public virtual Role Role { get; set; } = null!;
}
