using BE.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Authentication
{
    [Route("api/[controller]")]
    [ApiController]
    public class Authentication : ControllerBase
    {
        private readonly AuthService _authService;

        public Authentication(AuthService authService)
        {
            _authService = authService;
        }
    }

    
}
