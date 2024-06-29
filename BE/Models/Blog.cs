using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Blog
{
    public int BlogId { get; set; }

    public string Content { get; set; } = null!;

    public string Title { get; set; } = null!;

    public int DocId { get; set; }

    public DateTime Date { get; set; }

    public string? Thumbnail { get; set; }

    public int AId { get; set; }

    public virtual ArticleManager AIdNavigation { get; set; } = null!;

    public virtual Doctor Doc { get; set; } = null!;

    public virtual ICollection<Img> Imgs { get; } = new List<Img>();
}
