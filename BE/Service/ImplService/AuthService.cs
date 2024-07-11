using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BE.DTOs;
using BE.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class AuthService
{
    private readonly MedPalContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(MedPalContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<string> Authenticate(LoginDto loginDto)
    {
        var user = await _context.Accounts
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == loginDto.Identifier || u.Phone == loginDto.Identifier);

        if (user == null || user.Password != loginDto.Password)
        {
            return null;
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Phone),
                new Claim(ClaimTypes.Role, user.Role?.RoleName ?? "User")
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
