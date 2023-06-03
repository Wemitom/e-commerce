using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using db_back.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace db_back.Controllers
{
    /// <summary>
    /// Controller for managing categories.
    /// </summary>
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ILogger<CategoriesController> _logger;

        private readonly ICategoryRepository _repository;

        public CategoriesController(ILogger<CategoriesController> logger, ICategoryRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        /// <summary>
        /// Gets a list of all categories.
        /// </summary>
        /// <returns>A list of category names.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<ActionResult<List<string>>> Get()
        {
            try
            {
                List<string> categories = await _repository.GetCategoriesAsync();

                return Ok(categories);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        /// <summary>
        /// Deletes a category.
        /// </summary>
        /// <param name="category">The name of the category to delete.</param>
        [Authorize]
        [HttpDelete("{category}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<ActionResult> DeleteAsync(string category)
        {
            var decodedCategory = Uri.UnescapeDataString(category);

            try
            {
                await _repository.DeleteCategoryAsync(decodedCategory);

                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category");

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        /// <summary>
        /// Creates a new category.
        /// </summary>
        /// <param name="category">The name of the new category.</param>
        [Authorize]
        [HttpPost("{category}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<ActionResult> Post([FromRoute] string category)
        {
            var decodedCategory = Uri.UnescapeDataString(category);

            try
            {
                await _repository.NewCategoryAsync(decodedCategory);

                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");

                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

    }
}