using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Question
{
    public int QuesId { get; set; }

    public int PatientId { get; set; }

    public string Question1 { get; set; } = null!;

    public DateTime QuesDate { get; set; }

    public int? DepId { get; set; }

    public int? DocId { get; set; }

    public DateTime? AnsDate { get; set; }

    public string? Answer { get; set; }

    public virtual Doctor? Doc { get; set; }

    public virtual Patient Patient { get; set; } = null!;
}
