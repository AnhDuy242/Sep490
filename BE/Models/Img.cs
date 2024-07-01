using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Img
{
    public int ImgId { get; set; }

    public string ImgUrl { get; set; } = null!;

    public int? BlogId { get; set; }

    public virtual Blog? Blog { get; set; }
}
