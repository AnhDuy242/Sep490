using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Type
{
    public int Id { get; set; }

    public string Type1 { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; } = new List<Notification>();
}
