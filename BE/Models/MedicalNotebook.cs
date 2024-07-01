using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class MedicalNotebook
{
    public int Id { get; set; }

    public string Prescription { get; set; } = null!;

    public string Diagnostic { get; set; } = null!;

    public string? TestResult { get; set; }

    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;
}
