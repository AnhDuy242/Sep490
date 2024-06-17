using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Img
{
    public int Id { get; set; }

    public string Img1 { get; set; } = null!;

    public virtual ICollection<BlogInfo> Blogs { get; } = new List<BlogInfo>();
}
