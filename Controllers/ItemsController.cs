using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using db_back.Models;
using db_back.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace db_back.Controllers
{
    /// <summary>
    /// Controller for handling items.
    /// </summary>
    [ApiController]
    [Route("api/items")]
    public class ItemsController : ControllerBase
    {
        private readonly ILogger<ItemsController> _logger;

        private readonly IItemRepository _repository;

        public ItemsController(ILogger<ItemsController> logger, IItemRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        /// <summary>
        /// Gets a list of all items.
        /// </summary>
        /// <returns>A list of all items.</returns>
        /// <response code="200">Success</response>
        /// <response code="500">Internal server error</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Item>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Get()
        {
            try
            {
                var items = await _repository.GetItemsAsync();

                return Ok(items);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve items");

                return StatusCode((int)HttpStatusCode.InternalServerError, new ErrorResponse { message = "Failed to retrieve items" });
            }
        }

        /// <summary>
        /// Gets the image for a specific item.
        /// </summary>
        /// <param name="id">The ID of the item.</param>
        /// <returns>The image for the item.</returns>
        /// <response code="200">Success</response>
        /// <response code="400">Bad request</response>
        [HttpGet("getImage/{id?}")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.BadRequest)]
        public async Task<ActionResult> GetImage(int id)
        {
            try
            {
                var image = await _repository.GetImageAsync(id);

                return Ok(new { image });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to retrieve image for item with ID {id}");

                return StatusCode((int)HttpStatusCode.InternalServerError, new ErrorResponse { message = $"Failed to retrieve image for item with ID {id}" });
            }
        }

        /// <summary>
        /// Creates a new item.
        /// </summary>
        /// <param name="item">The new item to create.</param>
        /// <returns>A success status code.</returns>
        /// <response code="200">Success</response>
        /// <response code="400">Bad request</response>
        /// <response code="500">Internal server error</response>
        [Authorize]
        [HttpPost]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Post([FromBody] NewItem item)
        {
            try
            {
                await _repository.NewItemAsync(item);

                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create new item");

                return StatusCode((int)HttpStatusCode.InternalServerError, new ErrorResponse { message = "Failed to create new item" });
            }
        }

        /// <summary>
        /// Deletes an item with the specified ID.
        /// </summary>
        /// <param name="id">The ID of the item to delete.</param>
        /// <returns>A success status code.</returns>
        /// <response code="200">Success</response>
        /// <response code="400">Bad request</response>
        /// <response code="500">Internal server error</response>
        [Authorize]
        [HttpDelete("{id?}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _repository.DeleteItemAsync(id);

                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete item with ID {id}");

                return StatusCode((int)HttpStatusCode.InternalServerError, new ErrorResponse { message = $"Failed to delete item with ID {id}" });
            }
        }

        /// <summary>
        /// Updates an item with the specified ID.
        /// </summary>
        /// <param name="item">The updated item.</param>
        /// <param name="id">The ID of the item to update.</param>
        /// <returns>A success status code.</returns>
        /// <response code="200">Success</response>
        /// <response code="400">Bad request</response>
        /// <response code="500">Internal server error</response>
        [Authorize]
        [HttpPut("{id?}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Put([FromBody] NewItem item, int id)
        {
            try
            {
                await _repository.UpdateItemAsync(item, id);

                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to update item with ID {id}");

                return StatusCode((int)HttpStatusCode.InternalServerError, new ErrorResponse { message = $"Failed to update item with ID {id}" });
            }
        }
    }
}