using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Blog
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int DoctorId { get; set; }

    public DateTime Date { get; set; }

    public string Thumbnail { get; set; } = null!;

    public int AuthorId { get; set; }

    public virtual ArticleManager Author { get; set; } = null!;

    public virtual BlogInfo? BlogInfo { get; set; }
}
