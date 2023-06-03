using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using db_back.Models;
using db_back.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace db_back.Controllers
{
    /// <summary>
    /// Controller for handling statistics.
    /// </summary>
    [ApiController]
    [Route("api/stats")]
    public class StatsController : ControllerBase
    {
        private readonly ILogger<StatsController> _logger;
        private readonly IStatsRepository _repository;

        public StatsController(ILogger<StatsController> logger, IStatsRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        /// <summary>
        /// Retrieve statistics by category.
        /// </summary>
        /// <returns>A list of statistics by category.</returns>
        [Authorize]
        [HttpGet("byCategory")]
        public async Task<ActionResult> Get()
        {
            try
            {
                var stats = await _repository.GetStatsByCategoryAsync();

                if (stats == null || stats.Count == 0)
                {
                    return NotFound("No statistics found.");
                }

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        /// <summary>
        /// Retrieve statistics by year.
        /// </summary>
        /// <returns>A list of statistics by year.</returns>
        [Authorize]
        [HttpGet("byYear")]
        public async Task<ActionResult> GetYear()
        {
            try
            {
                var stats = await _repository.GetStatsByYearAsync();

                if (stats == null || stats.Count == 0)
                {
                    return NotFound("No statistics found.");
                }

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }
    }
}