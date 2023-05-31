using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Odbc;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using db_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace db_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly ILogger<ItemsController> _logger;

        public ItemsController(ILogger<ItemsController> logger)
        {
            _logger = logger;
        }

        /// <returns></returns>
        /// <response code="200">Успех</response>
        /// <response code="500">Ошибка</response>
        [HttpGet]
        [ProducesResponseType(typeof(Item[]), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public JsonResult Get()
        {
            _logger.LogTrace($"[{DateTime.Now}] GET req on /items\n");
            DbDataReader reader;
            JsonResult result;

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("SELECT ITEM_ID, TITLE, PRICE, CATEGORY FROM ITEMS", dbConnection);
                    reader = command.ExecuteReader();

                    var list = new List<Item>();
                    while (reader.Read())
                    {
                        list.Add(new Item
                        {
                            id = (int)reader["ITEM_ID"],
                            title = (string)reader["TITLE"],
                            price = (int)reader["PRICE"],
                            category = (string)reader["CATEGORY"]
                        });
                    }

                    _logger.LogInformation($"[{DateTime.Now}] GET Req on /items fulfilled with status code 200\n");
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

        [HttpGet("[action]/{id?}")]
        public JsonResult? GetImage(int id)
        {
            _logger.LogTrace($"[{DateTime.Now}] GET req on /getimage/{id}\n");

            DbDataReader reader;
            JsonResult result;

            try
            {
                using var dbConnection = new DbConnection().connection;
                OdbcCommand command = new OdbcCommand("SELECT IMAGE FROM ITEMS WHERE ITEM_ID=?", dbConnection);
                command.Parameters.AddWithValue("@id", id);
                reader = command.ExecuteReader();

                reader.Read();
                if (reader.FieldCount != 0)
                    _logger.LogInformation($"[{DateTime.Now}] Req on /getimage/items fulfilled with status code 200\n");
                result = new JsonResult(new { image = reader[0] != System.DBNull.Value ? Convert.ToBase64String((byte[])reader[0]) : null }) { StatusCode = 200 };
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

        /// <returns></returns>
        /// <response code="200">Успех</response>
        /// <response code="401">Ошибка авторизации</response>
        /// <response code="500">Ошибка</response>
        [Authorize]
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public dynamic Post([FromBody] NewItem item)
        {
            _logger.LogTrace($"[{DateTime.Now}] POST req on /items\n");

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("INSERT INTO ITEMS(TITLE, PRICE, CATEGORY, IMAGE) VALUES (?, ?, ?, ?)", dbConnection);
                    command.Parameters.AddWithValue("@title", item.title);
                    command.Parameters.AddWithValue("@price", item.price);
                    command.Parameters.AddWithValue("@category", item.category);
                    command.Parameters.AddWithValue("@image", item.image != null ? Convert.FromBase64String(item.image) : null);
                    command.ExecuteNonQuery();

                    _logger.LogInformation($"[{DateTime.Now}] POST req on /items fulfilled with status code 200\n");
                    return StatusCode(200);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[{DateTime.Now}] Error trying to exec query\n{ex.Message}\nReq not fulfilled with status code 500");

                return new JsonResult(new ErrorResponse { code = ErrorCodes.Unknown, message = "Unknown error" })
                {
                    StatusCode = 500
                };
            }
        }

        /// <returns></returns>
        /// <response code="200">Успех</response>
        /// <response code="401">Ошибка авторизации</response>
        /// <response code="500">Ошибка</response>
        [Authorize]
        [HttpDelete("{id?}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public dynamic Delete(int id)
        {
            _logger.LogTrace($"[{DateTime.Now}] DELETE req on /items\n");

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("DELETE FROM ITEMS WHERE ITEM_ID=?", dbConnection);
                    command.Parameters.AddWithValue("@id", id);
                    command.ExecuteNonQuery();

                    _logger.LogInformation($"[{DateTime.Now}] DELETE req on /items fulfilled with status code 200\n");
                    return StatusCode(200);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[{DateTime.Now}] Error trying to exec query\n{ex.Message}\nReq not fulfilled with status code 500");

                return new JsonResult(new { message = "Unknown error" })
                {
                    StatusCode = 500
                };
            }
        }

        /// <returns></returns>
        /// <response code="200">Успех</response>
        /// <response code="401">Ошибка авторизации</response>
        /// <response code="500">Ошибка</response>
        [HttpPut("{id?}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public dynamic Put([FromBody] NewItem item, int id)
        {
            _logger.LogTrace($"[{DateTime.Now}] PUT req on /items\n");

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("UPDATE ITEMS SET TITLE=?, PRICE=?, CATEGORY=?, IMAGE=? WHERE ITEM_ID=?", dbConnection);
                    command.Parameters.AddWithValue("@title", item.title);
                    command.Parameters.AddWithValue("@price", item.price);
                    command.Parameters.AddWithValue("@category", item.category);
                    command.Parameters.AddWithValue("@image", item.image != null ? Convert.FromBase64String(item.image) : null);
                    command.Parameters.AddWithValue("@id", id);
                    command.ExecuteNonQuery();

                    _logger.LogInformation($"[{DateTime.Now}] PUT req on /items fulfilled with status code 200\n");
                    return StatusCode(200);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[{DateTime.Now}] Error trying to exec query\n{ex.Message}\nReq not fulfilled with status code 500");

                return new JsonResult(new ErrorResponse { code = ErrorCodes.Unknown, message = "Unknown error" })
                {
                    StatusCode = 500
                };
            }
        }
    }
}
