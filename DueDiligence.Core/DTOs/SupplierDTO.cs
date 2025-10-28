using System.ComponentModel.DataAnnotations;

namespace DueDiligence.Core.DTOs

{
    public class SupplierDTO
    {
        public int Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string TradeName { get; set; } = string.Empty;
        public string TaxId { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public decimal AnnualRevenue { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    // Base class with common validation rules
    public abstract class SupplierBaseDTO
    {
        [Required(ErrorMessage = "Business name is required")]
        [StringLength(100, ErrorMessage = "Business name cannot exceed 100 characters")]
        public string BusinessName { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Trade name cannot exceed 100 characters")]
        public string TradeName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Tax ID is required")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "Tax ID must have 11 digits")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "Tax ID must contain only numbers")]
        public string TaxId { get; set; } = string.Empty;
        
        [RegularExpression(@"^$|^[\+]?[1-9][\d]{0,15}$", ErrorMessage = "Invalid phone number format")]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [RegularExpression(@"^$|^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;
        
        [RegularExpression(@"^$|^https?://.*", ErrorMessage = "Invalid website format")]
        public string Website { get; set; } = string.Empty;
        
        public string Address { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Country is required")]
        public string Country { get; set; } = string.Empty;
        
        [Range(0, double.MaxValue, ErrorMessage = "Annual revenue must be a positive value")]
        public decimal AnnualRevenue { get; set; }
    }

    public class CreateSupplierDTO : SupplierBaseDTO
    {
        // Inherits all validation rules from SupplierBaseDTO
        // Add any create-specific properties here if needed
    }

    public class UpdateSupplierDTO : SupplierBaseDTO
    {
        // Inherits all validation rules from SupplierBaseDTO
        // ID is not included - it comes from the route parameter
        // Add any update-specific properties here if needed
    }
}