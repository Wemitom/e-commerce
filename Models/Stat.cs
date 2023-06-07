namespace db_back.Models
{
    public class Stat
    {
        public string label { get; set; }

        public int data { get; set; }
    }

    public class StatsTypes
    {
        public const string byCategory = "byCategory";
        public const string byYear = "byYear";
        public const string itemsByCategory = "itemsByCategory";
    }
}
