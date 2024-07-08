using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Feedback
{
    public int FeedId { get; set; }

    public int PatientId { get; set; }

    public string? Content { get; set; }

    public DateTime Date { get; set; }

    public int? Star { get; set; }

    public virtual ICollection<FeedbackRe> FeedbackRes { get; set; } = new List<FeedbackRe>();

    public virtual Patient Patient { get; set; } = null!;
}
