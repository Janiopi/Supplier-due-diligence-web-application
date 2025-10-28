using DueDiligence.Core.DTOs;
using DueDiligence.Core.Interfaces;
using DueDiligence.Infrastructure.ExternalServices;

namespace DueDiligence.Infrastructure.Services
{
    public class ScreeningService : IScreeningService
    {
        private readonly ScreeningApiClient _apiClient;
        private readonly ISupplierRepository _supplierRepository;

        public ScreeningService(ScreeningApiClient apiClient, ISupplierRepository supplierRepository)
        {
            _apiClient = apiClient;
            _supplierRepository = supplierRepository;
        }

        public async Task<IEnumerable<ScreeningResultDTO>> ScreenSupplierAsync(int supplierId, List<string> sources)
        {
            // Get the supplier to use their business name for screening
            var supplier = await _supplierRepository.GetByIdAsync(supplierId);
            if (supplier == null)
            {
                throw new ArgumentException($"Supplier with ID {supplierId} not found.");
            }

            string entityName = supplier.BusinessName;
            
            // Call the external API
            var response = await _apiClient.SearchEntityAsync(entityName, sources);
            
            // Transform API response to our DTO format
            var results = new List<ScreeningResultDTO>();
            
            foreach (var sourceResult in response.Results)
            {
                if (sourceResult.Status.ToLower() == "success" && sourceResult.Data.Count > 0)
                {
                    // Create a risk assessment based on the number of hits
                    int riskLevel = sourceResult.Data.Count switch
                    {
                        > 10 => 3, // High risk if many matches
                        > 5 => 2,  // Medium risk if several matches
                        > 0 => 1,  // Low risk if few matches
                        _ => 0     // No risk if no matches
                    };
                    
                    results.Add(new ScreeningResultDTO
                    {
                        SupplierId = supplierId,
                        SourceName = sourceResult.Source,
                        Found = sourceResult.Data.Count > 0,
                        Details = $"Found {sourceResult.Data.Count} matches in {sourceResult.Data.Source}.",
                        RiskLevel = riskLevel
                    });
                }
                else
                {
                    results.Add(new ScreeningResultDTO
                    {
                        SupplierId = supplierId,
                        SourceName = sourceResult.Source,
                        Found = false,
                        Details = "No matches found or search failed.",
                        RiskLevel = 0
                    });
                }
            }
            
            return results;
        }
    }
}