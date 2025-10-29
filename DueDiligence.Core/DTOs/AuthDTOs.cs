using System.ComponentModel.DataAnnotations;

namespace DueDiligence.Core.DTOs
{
    // Request DTOs
    public class RegisterRequestDTO
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters")]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }

    // Response DTOs
    public class AuthResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public AuthDataDTO? Data { get; set; }
        public string? Error { get; set; }
    }

    public class AuthDataDTO
    {
        public string Token { get; set; } = string.Empty;
        public UserDTO User { get; set; } = new();
        public string? Message { get; set; }
        public DateTime? Timestamp { get; set; }
    }

    public class UserDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class LogoutResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public LogoutDataDTO? Data { get; set; }
    }

    public class LogoutDataDTO
    {
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
