using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Week
{
    public int Id { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public virtual ICollection<Schedule> Schedules { get; } = new List<Schedule>();
}
