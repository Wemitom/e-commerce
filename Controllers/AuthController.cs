using System;
using System.Data.Odbc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using db_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace db_back.Controllers
{
    /// <summary>
    /// Controller for handling authentication requests.
    /// </summary>
    [ApiController]
    [Route("/api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;

        private readonly OdbcConnection _connection;

        public AuthController(IConfiguration configuration, ILogger<AuthController> logger, OdbcConnection connection)
        {
            _logger = logger;
            _configuration = configuration;
            _connection = connection;
        }

        /// <summary>
        /// Verifies the manager's credentials and generates a JWT token for authorization.
        /// </summary>
        /// <param name="credentials">The manager's credentials.</param>
        /// <returns>An HTTP response indicating success or failure.</returns>
        [HttpPost]
        public async Task<ActionResult> Post(ManagerCredentials credentials)
        {
            await _connection.OpenAsync();

            try
            {
                var query = "SELECT [dbo].[VERIFY_ACCOUNT](?, ?)";
                bool verified = false;
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@username", credentials.username);
                    command.Parameters.AddWithValue("@password", credentials.password);
                    using (var reader = command.ExecuteReader())
                    {
                        reader.Read();
                        verified = Convert.ToBoolean(reader[0]);
                    }
                }

                if (verified)
                {
                    var issuer = _configuration["JWT:Issuer"];
                    var audience = _configuration["JWT:Audience"];
                    var key = Encoding.ASCII.GetBytes
                    (_configuration["JWT:Key"]);
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

                    Response.Cookies.Append("jwt_token", stringToken, new Microsoft.AspNetCore.Http.CookieOptions
                    {
                        HttpOnly = true,
                        SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict
                    });
                    return Ok();
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error getting categories: " + ex.Message);
            }
            finally
            {
                await _connection.CloseAsync();
            }

            return Unauthorized();
        }

        /// <summary>
        /// Logs out the current user.
        /// </summary>
        /// <returns>An HTTP response indicating success or failure.</returns>
        [HttpGet("logOut")]
        [Authorize]
        public ActionResult LogOut()
        {
            Response.Cookies.Delete("jwt_token");
            return Ok();
        }
    }
}