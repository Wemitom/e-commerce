namespace db_back.Models
{
    public class Item
    {
        public int id { get; set; }

        public string title { get; set; }

        public int price { get; set; }

        public string category { get; set; }

        public byte[]? image { get; set; }
    }
}
