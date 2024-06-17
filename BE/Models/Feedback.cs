using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Feedback
{
    public int Id { get; set; }

    public int PatientId { get; set; }

    public string Content { get; set; } = null!;

    public int Star { get; set; }

    public DateTime Date { get; set; }

    public int? ResId { get; set; }

    public int? ReceptionistId { get; set; }

    public virtual Patient Patient { get; set; } = null!;

    public virtual Receptionist? Receptionist { get; set; }
}
