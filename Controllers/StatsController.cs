using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using db_back.Models;
using db_back.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;

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
        /// Retrieve statistics of the chosen type.
        /// </summary>
        /// <param name="type">Type of statistic to retrieve</param>
        /// <returns>A list of statistics.</returns>
        [Authorize]
        [HttpGet("{type}")]
        [ProducesResponseType(typeof(List<Stat>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Get([FromRoute] String type)
        {
            try
            {
                List<Stat>? stats;

                switch (type)
                {
                    case (StatsTypes.byCategory):
                        stats = await _repository.GetStatsByCategoryAsync();
                        break;
                    case (StatsTypes.byYear):
                        stats = await _repository.GetStatsByYearAsync();
                        break;
                    case (StatsTypes.itemsByCategory):
                        stats = await _repository.GetStatsItemsByCategoryAsync();
                        break;
                    default:
                        stats = null;
                        break;
                }

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
        /// Export statistics to the Excel.
        /// </summary>
        /// <returns>Excel file with the statistics.</returns>
        [HttpGet("export")]
        [ProducesResponseType(typeof(FileStream), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.InternalServerError)]
        public async Task<ActionResult> Download()
        {
            try
            {
                List<Stat>? stats = await _repository.GetStatsByCategoryAsync();

                if (stats == null || stats.Count == 0)
                {
                    return NotFound("No statistics found.");
                }

                Stream stream = new MemoryStream();
                using (ExcelPackage p = new ExcelPackage("StatsTemplate.xlsx"))
                {
                    ExcelWorksheet wsEstimate = p.Workbook.Worksheets["Stats"];
                    wsEstimate.Cells[$"A2:B{stats.Count + 1}"].LoadFromCollection(stats);
                    p.SaveAs(stream);
                    stream.Position = 0;
                }

                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Stats.xlsx");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }
    }
}