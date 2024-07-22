using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class TestResult
{
    public int ImgId { get; set; }

    public string ImgUrl { get; set; } = null!;

    public int MId { get; set; }

    public virtual MedicalNotebook MIdNavigation { get; set; } = null!;
}
