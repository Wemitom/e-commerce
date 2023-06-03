using System.Threading.Tasks;
using System.Collections.Generic;
using System.Data.Odbc;
using db_back.Models;
using Microsoft.Extensions.Logging;

namespace db_back.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<string>> GetCategoriesAsync();
        Task NewCategoryAsync(string name);
        Task DeleteCategoryAsync(string name);
    }

    public class CategoryRepository : ICategoryRepository
    {
        private readonly ILogger<CategoryRepository> _logger;

        private readonly OdbcConnection _connection;

        public CategoryRepository(ILogger<CategoryRepository> logger, OdbcConnection connection)
        {
            _logger = logger;
            _connection = connection;
        }

        public async Task<List<string>> GetCategoriesAsync()
        {
            List<string> categories = new List<string>();

            try
            {
                await _connection.OpenAsync();

                string query = "SELECT * FROM CATEGORIES";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            categories.Add((string)reader["CATEGORY"]);
                        }
                    }
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error getting categories: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }

            return categories;
        }

        public async Task NewCategoryAsync(string name)
        {
            await _connection.OpenAsync();

            try
            {
                string query = "INSERT INTO CATEGORIES VALUES(?)";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@category", name);
                    await command.ExecuteNonQueryAsync();
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error inserting category: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }
        }

        public async Task DeleteCategoryAsync(string name)
        {
            await _connection.OpenAsync();

            try
            {
                string query = "DELETE FROM CATEGORIES WHERE CATEGORY=?";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@category", name);
                    await command.ExecuteNonQueryAsync();
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error deleting category: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }
        }
    }
}