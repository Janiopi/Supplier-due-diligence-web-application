namespace DueDiligence.Core.Entities
{
    public class Supplier
    {
        public int Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string TradeName { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty; // 11 digits
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public decimal AnnualRevenue { get; set; } // In dollars
        public DateTime LastUpdated { get; set; }
    }
}