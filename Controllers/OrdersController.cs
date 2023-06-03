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
using db_back.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace db_back.Controllers
{
    /// <summary>
    /// Controller for handling orders.
    /// </summary>
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> _logger;

        private readonly IOrderRepository _repository;

        public OrdersController(ILogger<OrdersController> logger, IOrderRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        /// <summary>
        /// Creates a new order.
        /// </summary>
        /// <param name="order">The order to create.</param>
        /// <returns>A HTTP status code indicating success or failure.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Order order)
        {
            try
            {
                if (order == null)
                {
                    return BadRequest("Order object cannot be null.");
                }

                if (order.orderData == null)
                {
                    return BadRequest("OrderData object cannot be null.");
                }

                if (string.IsNullOrEmpty(order.orderData.firstName) || string.IsNullOrEmpty(order.orderData.lastName))
                {
                    return BadRequest("OrderData object must contain both a first name and a last name.");
                }

                if (string.IsNullOrEmpty(order.orderData.email))
                {
                    return BadRequest("OrderData object must contain an email address.");
                }

                if (string.IsNullOrEmpty(order.orderData.address))
                {
                    return BadRequest("OrderData object must contain a billing address.");
                }

                if (string.IsNullOrEmpty(order.orderData.cardNum))
                {
                    return BadRequest("OrderData object must contain a credit card number.");
                }

                if (string.IsNullOrEmpty(order.orderData.cardExp))
                {
                    return BadRequest("OrderData object must contain a credit card expiration date.");
                }

                if (string.IsNullOrEmpty(order.orderData.cardCVC))
                {
                    return BadRequest("OrderData object must contain a credit card CVC code.");
                }

                if (string.IsNullOrEmpty(order.orderData.cardFullname))
                {
                    return BadRequest("OrderData object must contain the full name on the credit card.");
                }

                if (order.items == null || order.items.Count == 0)
                {
                    return BadRequest("Order object must contain at least one item.");
                }

                await _repository.OrderAsync(order);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }
    }
}