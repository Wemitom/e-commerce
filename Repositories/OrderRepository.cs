using System.Threading.Tasks;
using System.Collections.Generic;
using System.Data.Odbc;
using db_back.Models;
using Microsoft.Extensions.Logging;
using System;

namespace db_back.Repositories
{
    public interface IOrderRepository
    {
        Task OrderAsync(Order order);
    }

    public class OrderRepository : IOrderRepository
    {
        private readonly ILogger<OrderRepository> _logger;

        private readonly OdbcConnection _connection;

        public OrderRepository(ILogger<OrderRepository> logger, OdbcConnection connection)
        {
            _logger = logger;
            _connection = connection;
        }

        public async Task OrderAsync(Order order)
        {
            await _connection.OpenAsync();
            using (OdbcTransaction transaction = _connection.BeginTransaction(System.Data.IsolationLevel.Serializable))
            {
                try
                {
                    string updateQuery = "INSERT INTO ORDERS(FULL_NAME, EMAIL, BILLING_ADDRESS, DELIVERY_ADDRESS, CREDIT_NUM, CREDIT_EXP, CREDIT_CVC, CREDIT_HOLDER) VALUES(?, ?, ?, ?, ?, ?, ?, ?); SELECT CAST(SCOPE_IDENTITY() AS INT) AS LAST_IDENTITY";

                    int newId = 0;
                    using (OdbcCommand updateCommand = new OdbcCommand(updateQuery, _connection))
                    {
                        updateCommand.Transaction = transaction;
                        updateCommand.Parameters.AddWithValue("@1", order.orderData.lastName + " " + order.orderData.firstName);
                        updateCommand.Parameters.AddWithValue("@2", order.orderData.email);
                        updateCommand.Parameters.AddWithValue("@3", order.orderData.address);
                        updateCommand.Parameters.AddWithValue("@4", order.orderData.addressDelivery);
                        updateCommand.Parameters.AddWithValue("@5", order.orderData.cardNum);
                        updateCommand.Parameters.AddWithValue("@6", order.orderData.cardExp);
                        updateCommand.Parameters.AddWithValue("@7", order.orderData.cardCVC);
                        updateCommand.Parameters.AddWithValue("@8", order.orderData.cardFullname);

                        using (var reader = await updateCommand.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                newId = reader[0] != System.DBNull.Value ? (int)reader[0] : 0;
                            }
                        }
                    }

                    string insertQuery = "INSERT INTO ORDER_ITEMS VALUES(?, ?, ?)";
                    foreach (var item in order.items)
                    {
                        using (OdbcCommand insertCommand = new OdbcCommand(insertQuery, _connection))
                        {
                            insertCommand.Transaction = transaction;
                            insertCommand.Parameters.AddWithValue("@1", newId);
                            insertCommand.Parameters.AddWithValue("@2", item.id);
                            insertCommand.Parameters.AddWithValue("@3", item.count);
                            await insertCommand.ExecuteNonQueryAsync();
                        }
                    }

                    await transaction.CommitAsync();
                }
                catch (OdbcException ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError("Error updating row: " + ex.Message);
                    throw;
                }
                finally
                {
                    await _connection.CloseAsync();
                }
            }
        }
    }
}