using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace db_back.Models
{
    public class OrderData
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string country { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string zip { get; set; }
        public string? countryDelivery { get; set; }
        public string? addressDelivery { get; set; }
        public string? cityDelivery { get; set; }
        public string? zipDelivery { get; set; }
        public string cardNum { get; set; }
        public string cardExp { get; set; }
        public string cardCVC { get; set; }
        public string cardFullname { get; set; }
    }

    public class ItemData
    {
        public int id { get; set; }
        public int count { get; set; }
    }

    public class Order
    {
        public OrderData orderData { get; set; }
        public List<ItemData> items { get; set; }
    }
}
