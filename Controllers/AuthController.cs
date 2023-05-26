using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Odbc;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using db_back.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace db_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<ItemsController> _logger;
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration, ILogger<ItemsController> logger)
        {
            _logger = logger;
            _configuration = configuration;
        }

        [HttpPost]
        public dynamic Post(ManagerCredentials credentials)
        {
            _logger.LogTrace($"[{DateTime.Now}] Auth attempt. username - {credentials.username}\n");

            using var dbConnection = new DbConnection().connection;
            OdbcCommand command = new OdbcCommand("SELECT 1 FROM MANAGERS WHERE USERNAME=? AND PASSWORD_HASH=?", dbConnection);
            command.Parameters.AddWithValue("@username", credentials.username);
            command.Parameters.AddWithValue("@password", credentials.password);
            var reader = command.ExecuteReader();

            if (reader.Read())
            {
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];
                var key = Encoding.ASCII.GetBytes
                (_configuration["Jwt:Key"]);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                new Claim("Id", Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, credentials.username),
                new Claim(JwtRegisteredClaimNames.Email, credentials.username),
                new Claim(JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString())
             }),
                    Expires = DateTime.UtcNow.AddMinutes(30),
                    Issuer = issuer,
                    Audience = audience,
                    SigningCredentials = new SigningCredentials
                    (new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha512Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var jwtToken = tokenHandler.WriteToken(token);
                var stringToken = tokenHandler.WriteToken(token);

                _logger.LogTrace($"[{DateTime.Now}] Attempt successful. Issued a token.\n");
                return stringToken;
            }

            _logger.LogTrace($"[{DateTime.Now}] Attempt failed.\n");
            return StatusCode(401);
        }
    }
}