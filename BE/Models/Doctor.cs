using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Doctor
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public int Age { get; set; }

    public string Phone { get; set; } = null!;

    public int DepartmentId { get; set; }

    public virtual ICollection<Answer> Answers { get; } = new List<Answer>();

    public virtual ICollection<Appointment> Appointments { get; } = new List<Appointment>();

    public virtual Department Department { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; } = new List<Notification>();

    public virtual ICollection<Schedule> Schedules { get; } = new List<Schedule>();
}
