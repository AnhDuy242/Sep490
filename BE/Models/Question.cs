using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Question
{
    public int Id { get; set; }

    public int PatientId { get; set; }

    public string Question1 { get; set; } = null!;

    public int DepartmentId { get; set; }

    public DateTime Date { get; set; }

    public virtual ICollection<Answer> Answers { get; } = new List<Answer>();

    public virtual Patient Patient { get; set; } = null!;
}
