using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Receptionist
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public int Age { get; set; }

    public string Phone { get; set; } = null!;

    public virtual ICollection<Feedback> Feedbacks { get; } = new List<Feedback>();

    public virtual ICollection<Notification> Notifications { get; } = new List<Notification>();
}
