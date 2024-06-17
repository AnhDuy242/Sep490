using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Notification
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public DateTime Date { get; set; }

    public int TypeId { get; set; }

    public int? DoctorId { get; set; }

    public int? PatientId { get; set; }

    public int? ReceptionistId { get; set; }

    public virtual Doctor? Doctor { get; set; }

    public virtual Patient? Patient { get; set; }

    public virtual Receptionist? Receptionist { get; set; }

    public virtual Type Type { get; set; } = null!;
}
