using System.Threading.Tasks;
using System.Collections.Generic;
using System.Data.Odbc;
using db_back.Models;
using Microsoft.Extensions.Logging;
using System;

namespace db_back.Repositories
{
    public interface IStatsRepository
    {
        Task<List<Stat>> GetStatsByCategoryAsync();
        Task<List<Stat>> GetStatsByYearAsync();
        Task<List<Stat>> GetStatsItemsByCategoryAsync();
    }

    public class StatsRepository : IStatsRepository
    {
        private readonly ILogger<StatsRepository> _logger;

        private readonly OdbcConnection _connection;

        public StatsRepository(ILogger<StatsRepository> logger, OdbcConnection connection)
        {
            _logger = logger;
            _connection = connection;
        }

        public async Task<List<Stat>> GetStatsByCategoryAsync()
        {
            List<Stat> stats = new List<Stat>();

            try
            {
                await _connection.OpenAsync();

                string query = "SELECT * FROM STATS";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            stats.Add(new Stat
                            {
                                label = (string)reader["CATEGORY"],
                                data = (int)reader["SUM"]
                            });
                        }
                    }
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error getting stats: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }

            return stats;
        }


        public async Task<List<Stat>> GetStatsByYearAsync()
        {
            List<Stat> stats = new List<Stat>();

            try
            {
                await _connection.OpenAsync();

                string query = "SELECT * FROM STATS_BY_YEAR()";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            stats.Add(
                              new Stat
                              {
                                  label = Convert.ToString((int)reader["YEAR"]),
                                  data = (int)reader["COUNT"]
                              }
                            );
                        }
                    }
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error getting stats: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }

            return stats;
        }

        public async Task<List<Stat>> GetStatsItemsByCategoryAsync()
        {
            List<Stat> stats = new List<Stat>();

            try
            {
                await _connection.OpenAsync();

                string query = "SELECT * FROM ITEMS_BY_CATEGORY";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            stats.Add(new Stat
                            {
                                label = (string)reader["CATEGORY"],
                                data = (int)reader["COUNT"]
                            });
                        }
                    }
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error getting stats: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }

            return stats;
        }
    }
}