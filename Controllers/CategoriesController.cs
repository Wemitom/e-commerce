using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Odbc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
        public JsonResult Get()
        {
            DbDataReader reader;
            JsonResult result;

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("SELECT * FROM CATEGORIES", dbConnection);
                    reader = command.ExecuteReader();


                    var list = new List<string>();
                    while (reader.Read())
                    {
                        list.Add(
                          (string)reader["CATEGORY"]
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

        [Authorize]
        [HttpDelete("{category?}")]
        public dynamic Delete(string category)
        {
            var decodedCategory = Uri.UnescapeDataString(category);
            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("DELETE FROM CATEGORIES WHERE CATEGORY=?", dbConnection);
                    command.Parameters.AddWithValue("@category", decodedCategory);
                    command.ExecuteNonQuery();

                    return StatusCode(200);
                }
            }
            catch
            {
                return new JsonResult(new { message = "Unknown error" })
                {
                    StatusCode = 500
                };
            }
        }

        [Authorize]
        [HttpPost("{category?}")]
        public dynamic Post([FromRoute] string category)
        {
            var decodedCategory = Uri.UnescapeDataString(category);
            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("INSERT INTO CATEGORIES VALUES(?)", dbConnection);
                    command.Parameters.AddWithValue("@category", decodedCategory);
                    command.ExecuteNonQuery();

                    return StatusCode(200);
                }
            }
            catch
            {
                return new JsonResult(new { message = "Unknown error" })
                {
                    StatusCode = 500
                };
            }
        }

    }
}