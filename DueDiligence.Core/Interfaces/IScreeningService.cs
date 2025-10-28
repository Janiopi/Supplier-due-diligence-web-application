using DueDiligence.Core.DTOs;

namespace DueDiligence.Core.Interfaces
{
    public interface IScreeningService
    {
        Task<IEnumerable<ScreeningResultDTO>> ScreenSupplierAsync(int supplierId, List<string> sources);
    }
}