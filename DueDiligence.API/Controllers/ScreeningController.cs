using DueDiligence.Core.DTOs;
using DueDiligence.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DueDiligence.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningService _screeningService;
        private readonly ISupplierRepository _supplierRepository;

        public ScreeningController(IScreeningService screeningService, ISupplierRepository supplierRepository)
        {
            _screeningService = screeningService;
            _supplierRepository = supplierRepository;
        }



        [HttpPost("screen")]
        public async Task<ActionResult<IEnumerable<ScreeningResultDTO>>> ScreenSupplier(ScreeningRequestDTO request)
        {
            if (request.Sources.Count < 1 || request.Sources.Count > 3)
            {
                return BadRequest("You must select between 1 and 3 sources");
            }

            // Get the supplier to use its name for screening
            var supplier = await _supplierRepository.GetByIdAsync(request.SupplierId);
            if (supplier == null)
            {
                return NotFound("Supplier not found");
            }

            // Now we have the supplier name for better screening results
            var results = await _screeningService.ScreenSupplierAsync(request.SupplierId, request.Sources);
            return Ok(results);
        }

        [HttpGet("sources")]
        public ActionResult<IEnumerable<string>> GetSources()
        {
            // List of available sources from your Node.js API
            var sources = new List<string>
            {
                "OffshoreLeaksScraper",
                "Ofac",
                "TheWorldBank"
            };

            return Ok(sources);
        }
        

    }
}