using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Receptionist
{
    public int RecepId { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public DateTime Dob { get; set; }

    public virtual ICollection<FeedbackRe> FeedbackRes { get; set; } = new List<FeedbackRe>();

    public virtual Account Recep { get; set; } = null!;
}
