using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Doctor
{
    public int DocId { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public int Age { get; set; }

    public int ServiceId { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Appointment> Appointments { get; } = new List<Appointment>();

    public virtual ICollection<Blog> Blogs { get; } = new List<Blog>();

    public virtual Account Doc { get; set; } = null!;

    public virtual ICollection<MedicalNotebook> MedicalNotebooks { get; } = new List<MedicalNotebook>();

    public virtual ICollection<Question> Questions { get; } = new List<Question>();

    public virtual ICollection<Schedule> Schedules { get; } = new List<Schedule>();

    public virtual Service Service { get; set; } = null!;
}
