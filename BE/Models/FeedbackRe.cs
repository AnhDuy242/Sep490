using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class FeedbackRe
{
    public int ResId { get; set; }

    public int FeedId { get; set; }

    public int? RecepId { get; set; }

    public int? PatientId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime Date { get; set; }

    public virtual Feedback Feed { get; set; } = null!;

    public virtual Receptionist? Recep { get; set; }
}
