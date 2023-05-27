using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace db_back.Models
{
    public class ErrorResponse
    {
        public ErrorCodes code { get; set; }
        public string message { get; set; }
    }

    public enum ErrorCodes
    {
        Unknown = 100,
        DbTimeout = 101,
        WrongParams = 102,
    }
}
