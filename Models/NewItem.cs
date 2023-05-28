using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace db_back.Models
{
    public class NewItem
    {
        public string title { get; set; }

        public int price { get; set; }

        public string category { get; set; }

        public string image { get; set; }
    }
}
