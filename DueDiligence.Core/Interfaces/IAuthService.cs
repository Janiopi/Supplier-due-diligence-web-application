using DueDiligence.Core.DTOs;

namespace DueDiligence.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request);
        Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request);
        Task<LogoutResponseDTO> LogoutAsync(string token);
        Task<bool> ValidateTokenAsync(string token);
        string? GetCurrentToken();
        void SetCurrentToken(string? token);
    }
}
