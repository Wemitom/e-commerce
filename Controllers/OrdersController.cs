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
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ILogger<OrdersController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public dynamic Post([FromBody] Order order)
        {
            DbDataReader reader;
            JsonResult result;

            try
            {
                using (var dbConnection = new DbConnection().connection)
                {
                    OdbcCommand command = new OdbcCommand("SELECT MAX(ORDER_ID) FROM ORDERS", dbConnection);
                    reader = command.ExecuteReader();
                    reader.Read();
                    var id = reader[0] != DBNull.Value ? (int)reader[0] + 1 : 0;

                    var transaction = dbConnection.BeginTransaction();
                    try
                    {
                        command = new OdbcCommand("INSERT INTO ORDERS(ORDER_ID, FULL_NAME, EMAIL, BILLING_ADDRESS, DELIVERY_ADDRESS, CREDIT_NUM, CREDIT_EXP, CREDIT_CVC, CREDIT_HOLDER) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", dbConnection, transaction);
                        command.Parameters.AddWithValue("@1", id);
                        command.Parameters.AddWithValue("@2", order.orderData.lastName + " " + order.orderData.firstName);
                        command.Parameters.AddWithValue("@3", order.orderData.email);
                        command.Parameters.AddWithValue("@4", order.orderData.address);
                        command.Parameters.AddWithValue("@5", order.orderData.addressDelivery);
                        command.Parameters.AddWithValue("@6", order.orderData.cardNum);
                        command.Parameters.AddWithValue("@7", order.orderData.cardExp);
                        command.Parameters.AddWithValue("@8", order.orderData.cardCVC);
                        command.Parameters.AddWithValue("@9", order.orderData.cardFullname);
                        command.ExecuteNonQuery();

                        foreach (var item in order.items)
                        {
                            command = new OdbcCommand("INSERT INTO ORDER_ITEMS VALUES(?, ?, ?)", dbConnection, transaction);
                            command.Parameters.AddWithValue("@1", id);
                            command.Parameters.AddWithValue("@2", item.id);
                            command.Parameters.AddWithValue("@3", item.count);
                            command.ExecuteNonQuery();
                        }
                    }
                    catch
                    {
                        transaction.Rollback();

                        result = new JsonResult(new { message = "Unknown error" })
                        {
                            StatusCode = 500
                        };
                        return result;
                    }

                    transaction.Commit();
                    return StatusCode(200);
                }
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