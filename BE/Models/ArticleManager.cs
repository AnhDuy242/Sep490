using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class ArticleManager
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Age { get; set; }

    public string Gender { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public virtual ICollection<Blog> Blogs { get; } = new List<Blog>();
}
