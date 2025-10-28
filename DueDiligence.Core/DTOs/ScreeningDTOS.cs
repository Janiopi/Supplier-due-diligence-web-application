namespace DueDiligence.Core.DTOs
{
    public class ScreeningResultDTO
    {
        public int SupplierId { get; set; }
        public string SourceName { get; set; } = string.Empty;
        public bool Found { get; set; }
        public string Details { get; set; } = string.Empty;
        public int RiskLevel { get; set; } // 1-Low, 2-Medium, 3-High
    }

    public class ScreeningRequestDTO
    {
        public int SupplierId { get; set; }
        public List<string> Sources { get; set; } = new List<string>();
    }
}