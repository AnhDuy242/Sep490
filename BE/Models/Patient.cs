using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Patient
{
    public int PatientId { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public string? Address { get; set; }

    public DateTime Dob { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<MedicalNotebook> MedicalNotebooks { get; set; } = new List<MedicalNotebook>();

    public virtual Account PatientNavigation { get; set; } = null!;

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
