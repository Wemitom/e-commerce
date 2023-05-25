using System;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Linq;
using System.Threading.Tasks;

namespace db_back
{
    public class DbConnection
    {
        public OdbcConnection connection { get; private set; }

        public DbConnection()
        {
            connection = new OdbcConnection("DSN=ODBC5;Database=B5;");
            connection.Open();
        }

        ~DbConnection()
        {
            if (connection != null)
                connection.Close();
        }
    }
}
