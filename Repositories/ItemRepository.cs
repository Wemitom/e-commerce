using System;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Threading.Tasks;
using db_back.Models;
using Microsoft.Extensions.Logging;

namespace db_back.Repositories
{
    public interface IItemRepository
    {
        Task<List<Item>> GetItemsAsync();
        Task<string?> GetImageAsync(int id);
        Task NewItemAsync(NewItem item);
        Task DeleteItemAsync(int id);
        Task UpdateItemAsync(NewItem item, int id);
    }

    public class ItemRepository : IItemRepository
    {
        private readonly ILogger<ItemRepository> _logger;

        private readonly OdbcConnection _connection;

        public ItemRepository(ILogger<ItemRepository> logger, OdbcConnection connection)
        {
            _logger = logger;
            _connection = connection;
        }

        public async Task<List<Item>> GetItemsAsync()
        {
            List<Item> items = new List<Item>();

            try
            {
                await _connection.OpenAsync();

                string query = "SELECT * FROM ITEMS";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            items.Add(new Item
                            {
                                id = (int)reader["ITEM_ID"],
                                title = (string)reader["TITLE"],
                                price = (int)reader["PRICE"],
                                category = (string)reader["CATEGORY"]
                            });
                        }
                    }
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error getting items: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }

            return items;
        }

        public async Task<string?> GetImageAsync(int id)
        {
            string? image = null;

            try
            {
                await _connection.OpenAsync();

                string query = "SELECT IMAGE FROM ITEMS WHERE ITEM_ID=?";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            image = reader[0] != System.DBNull.Value ? Convert.ToBase64String((byte[])reader[0]) : null;
                        }
                    }
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError($"Error getting image {id}: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }

            return image;
        }

        public async Task NewItemAsync(NewItem item)
        {
            await _connection.OpenAsync();

            try
            {
                string query = "INSERT INTO ITEMS(TITLE, PRICE, CATEGORY, IMAGE) VALUES (?, ?, ?, ?)";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@title", item.title);
                    command.Parameters.AddWithValue("@price", item.price);
                    command.Parameters.AddWithValue("@category", item.category);
                    command.Parameters.AddWithValue("@image", item.image != null ? Convert.FromBase64String(item.image) : null);
                    await command.ExecuteNonQueryAsync();
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error inserting row: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }
        }

        public async Task DeleteItemAsync(int id)
        {
            await _connection.OpenAsync();

            try
            {
                string query = "DELETE FROM ITEMS WHERE ITEM_ID=?";
                using (OdbcCommand command = new OdbcCommand(query, _connection))
                {
                    command.Parameters.AddWithValue("@id", id);
                    await command.ExecuteNonQueryAsync();
                }
            }
            catch (OdbcException ex)
            {
                _logger.LogError("Error deleting row: " + ex.Message);
            }
            finally
            {
                _connection.Close();
            }
        }

        public async Task UpdateItemAsync(NewItem item, int id)
        {
            await _connection.OpenAsync();
            using (OdbcTransaction transaction = _connection.BeginTransaction(System.Data.IsolationLevel.Serializable))
            {
                try
                {
                    string selectQuery = "SELECT * FROM ITEMS WITH(UPDLOCK, ROWLOCK, HOLDLOCK, NOWAIT) WHERE ITEM_ID = ?";
                    using (OdbcCommand selectCommand = new OdbcCommand(selectQuery, _connection))
                    {
                        selectCommand.Transaction = transaction;
                        selectCommand.Parameters.AddWithValue("@id", id);

                        using (var reader = await selectCommand.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                reader.Close();

                                // Задержка для тестирования лока
                                string waitForQuery = "WAITFOR DELAY '00:00:05';";
                                using (OdbcCommand waitForCommand = new OdbcCommand(waitForQuery, _connection))
                                {
                                    waitForCommand.Transaction = transaction;
                                    await waitForCommand.ExecuteNonQueryAsync();
                                }

                                string updateQuery = "UPDATE ITEMS SET TITLE=?, PRICE=?, CATEGORY=?, IMAGE=? WHERE ITEM_ID=?";
                                using (OdbcCommand updateCommand = new OdbcCommand(updateQuery, _connection))
                                {
                                    updateCommand.Transaction = transaction;
                                    updateCommand.Parameters.AddWithValue("@title", item.title);
                                    updateCommand.Parameters.AddWithValue("@price", item.price);
                                    updateCommand.Parameters.AddWithValue("@category", item.category);
                                    updateCommand.Parameters.AddWithValue("@image", item.image != null ? Convert.FromBase64String(item.image) : null);
                                    updateCommand.Parameters.AddWithValue("@id", id);

                                    await updateCommand.ExecuteNonQueryAsync();
                                }
                            }
                        }
                    }

                    transaction.Commit();
                }
                catch (OdbcException ex)
                {
                    transaction.Rollback();
                    _logger.LogError("Error updating row: " + ex.Message);
                    throw;
                }
                finally
                {
                    _connection.Close();
                }
            }
        }
    }
}