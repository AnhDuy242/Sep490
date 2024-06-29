using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class ArticleManager
{
    public int AId { get; set; }

    public string Name { get; set; } = null!;

    public string Gender { get; set; } = null!;

    public DateTime Dob { get; set; }

    public virtual Account AIdNavigation { get; set; } = null!;

    public virtual ICollection<Blog> Blogs { get; } = new List<Blog>();
}
