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
    public class StatsController : ControllerBase
    {
        private readonly ILogger<ItemsController> _logger;

        public StatsController(ILogger<ItemsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("byCategory")]
        public JsonResult Get()
        {
            DbDataReader reader;
            JsonResult result;

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("SELECT * FROM STATS", dbConnection);
                    reader = command.ExecuteReader();

                    var list = new List<Stat>();
                    while (reader.Read())
                    {
                        list.Add(
                          new Stat
                          {
                              label = (string)reader["CATEGORY"],
                              data = (int)reader["SUM"]
                          }
                        );
                    }

                    result = new JsonResult(list)
                    {
                        StatusCode = 200
                    };
                }
                return result;
            }
            catch
            {
                result = new JsonResult(new { message = "Unknown error" })
                {
                    StatusCode = 500
                };
                return result;
            }
        }

        [HttpGet("byYear")]
        public JsonResult GetYear()
        {
            DbDataReader reader;
            JsonResult result;

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("SELECT * FROM STATS_BY_YEAR()", dbConnection);
                    reader = command.ExecuteReader();

                    var list = new List<Stat>();
                    while (reader.Read())
                    {
                        list.Add(
                          new Stat
                          {
                              label = Convert.ToString((int)reader["YEAR"]),
                              data = (int)reader["COUNT"]
                          }
                        );
                    }

                    result = new JsonResult(list)
                    {
                        StatusCode = 200
                    };
                }
                return result;
            }
            catch
            {
                result = new JsonResult(new { message = "Unknown error" })
                {
                    StatusCode = 500
                };
                return result;
            }
        }
    }
}