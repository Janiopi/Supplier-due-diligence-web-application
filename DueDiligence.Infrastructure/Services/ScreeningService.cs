using DueDiligence.Core.DTOs;
using DueDiligence.Core.Interfaces;

namespace DueDiligence.Infrastructure.Services
{
    public class ScreeningService : IScreeningService
    {
        // In a real implementation, this would connect to an external API
        // For this example, we simulate results
        public async Task<IEnumerable<ScreeningResultDTO>> ScreenSupplierAsync(int supplierId, List<string> sources)
        {
            // Simulate an external API call
            await Task.Delay(500); // Simulate network latency
            
            var results = new List<ScreeningResultDTO>();
            
            // Simulated list of available sources
            var availableSources = new List<string> 
            { 
                "OFAC", 
                "PEP List", 
                "EU Sanctions List",
                "Financial Fraud List"
            };
            
            // Filter only valid sources
            var validSources = sources.Where(f => availableSources.Contains(f)).ToList();
            
            // Create simulated results
            foreach (var source in validSources)
            {
                // Simulate different results based on source
                // In a real implementation, this would come from the API
                bool found = source == "OFAC" && supplierId % 5 == 0;
                int riskLevel = found ? 3 : 1;
                
                results.Add(new ScreeningResultDTO
                {
                    SupplierId = supplierId,
                    SourceName = source,
                    Found = found,
                    Details = found 
                        ? "Matches found in the list." 
                        : "No matches found.",
                    RiskLevel = riskLevel
                });
            }
            
            return results;
        }
    }
}