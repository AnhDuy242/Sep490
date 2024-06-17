using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Answer
{
    public int Id { get; set; }

    public int QuesId { get; set; }

    public int DoctorId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime Date { get; set; }

    public virtual Doctor Doctor { get; set; } = null!;

    public virtual Question Ques { get; set; } = null!;
}
