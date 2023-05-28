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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace db_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ILogger<ItemsController> _logger;

        public CategoriesController(ILogger<ItemsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<JsonResult> Get()
        {
            _logger.LogTrace($"[{DateTime.Now}] GET req on /categories\n");
            DbDataReader reader;
            JsonResult result;

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("SELECT * FROM CATEGORIES", dbConnection);
                    reader = await command.ExecuteReaderAsync();


                    var list = new List<string>();
                    while (reader.Read())
                    {
                        list.Add(
                          (string)reader["CATEGORY"]
                        );
                    }

                    _logger.LogInformation($"[{DateTime.Now}] GET Req on /categories fulfilled with status code 200\n");
                    result = new JsonResult(list)
                    {
                        StatusCode = 200
                    };
                }
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[{DateTime.Now}] Error trying to exec query\n{ex.Message}\nReq not fulfilled with status code 500");

                result = new JsonResult(new { message = "Unknown error" })
                {
                    StatusCode = 500
                };
                return result;
            }
        }
    }
}