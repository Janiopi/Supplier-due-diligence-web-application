using DueDiligence.Core.DTOs;
using DueDiligence.Core.Entities;
using DueDiligence.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DueDiligence.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierRepository _supplierRepository;

        public SuppliersController(ISupplierRepository supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        // Helper method to map Supplier entity to SupplierDTO
        private static SupplierDTO MapToSupplierDTO(Supplier supplier)
        {
            return new SupplierDTO
            {
                Id = supplier.Id,
                BusinessName = supplier.BusinessName,
                TradeName = supplier.TradeName,
                TaxId = supplier.TaxId,
                PhoneNumber = supplier.PhoneNumber,
                Email = supplier.Email,
                Website = supplier.Website,
                Address = supplier.Address,
                Country = supplier.Country,
                AnnualRevenue = supplier.AnnualRevenue,
                LastUpdated = supplier.LastUpdated
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDTO>>> GetSuppliers()
        {
            var suppliers = await _supplierRepository.GetAllAsync();
            var suppliersDto = suppliers.Select(MapToSupplierDTO);
            
            return Ok(suppliersDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierDTO>> GetSupplier(int id)
        {
            var supplier = await _supplierRepository.GetByIdAsync(id);
            
            if (supplier == null)
            {
                return NotFound($"Supplier with ID {id} not found.");
            }

            return Ok(MapToSupplierDTO(supplier));
        }

        [HttpPost]
        public async Task<ActionResult<SupplierDTO>> CreateSupplier(CreateSupplierDTO supplierDto)
        {
            // Validate model state
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .Select(x => new { 
                        Field = x.Key, 
                        Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>()
                    });
                
                return BadRequest(new { 
                    Message = "Validation failed", 
                    Errors = errors 
                });
            }

            var supplier = new Supplier
            {
                BusinessName = supplierDto.BusinessName,
                TradeName = supplierDto.TradeName,
                TaxId = supplierDto.TaxId,
                PhoneNumber = supplierDto.PhoneNumber,
                Email = supplierDto.Email,
                Website = supplierDto.Website,
                Address = supplierDto.Address,
                Country = supplierDto.Country,
                AnnualRevenue = supplierDto.AnnualRevenue,
                LastUpdated = DateTime.UtcNow
            };

            await _supplierRepository.CreateAsync(supplier);
            
            return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, MapToSupplierDTO(supplier));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, UpdateSupplierDTO supplierDto)
        {
            // Validate model state
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .Select(x => new { 
                        Field = x.Key, 
                        Errors = x.Value?.Errors.Select(e => e.ErrorMessage) ?? new List<string>()
                    });
                
                return BadRequest(new { 
                    Message = "Validation failed", 
                    Errors = errors 
                });
            }

            var existingSupplier = await _supplierRepository.GetByIdAsync(id);
            
            if (existingSupplier == null)
            {
                return NotFound($"Supplier with ID {id} not found.");
            }

            // Update properties
            existingSupplier.BusinessName = supplierDto.BusinessName;
            existingSupplier.TradeName = supplierDto.TradeName;
            existingSupplier.TaxId = supplierDto.TaxId;
            existingSupplier.PhoneNumber = supplierDto.PhoneNumber;
            existingSupplier.Email = supplierDto.Email;
            existingSupplier.Website = supplierDto.Website;
            existingSupplier.Address = supplierDto.Address;
            existingSupplier.Country = supplierDto.Country;
            existingSupplier.AnnualRevenue = supplierDto.AnnualRevenue;

            await _supplierRepository.UpdateAsync(existingSupplier);
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _supplierRepository.GetByIdAsync(id);
            
            if (supplier == null)
            {
                return NotFound($"Supplier with ID {id} not found.");
            }

            await _supplierRepository.DeleteAsync(id);
            
            return NoContent();
        }
    }
}