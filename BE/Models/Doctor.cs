﻿using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Doctor
{
    public int DocId { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public int Age { get; set; }

    public int DepId { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();

    public virtual Department Dep { get; set; } = null!;

    public virtual Account Doc { get; set; } = null!;

    public virtual ICollection<MedicalNotebook> MedicalNotebooks { get; set; } = new List<MedicalNotebook>();

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
