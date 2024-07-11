using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Week
{
    public int WeekId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public virtual ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
