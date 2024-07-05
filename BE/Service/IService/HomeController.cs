using Microsoft.AspNetCore.Mvc;

namespace BE.Service
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
