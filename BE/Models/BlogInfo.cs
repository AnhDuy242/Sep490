using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class BlogInfo
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public string? Img1 { get; set; }

    public string? Img2 { get; set; }

    public string? Img3 { get; set; }

    public string? Img4 { get; set; }

    public string? Img5 { get; set; }

    public virtual Blog IdNavigation { get; set; } = null!;

    public virtual ICollection<Img> Imgs { get; } = new List<Img>();
}
