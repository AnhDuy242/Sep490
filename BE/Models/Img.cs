using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Img
{
    public int ImgId { get; set; }

    public string ImgUrl { get; set; } = null!;

    public virtual ICollection<Blog> Blogs { get; } = new List<Blog>();
}
