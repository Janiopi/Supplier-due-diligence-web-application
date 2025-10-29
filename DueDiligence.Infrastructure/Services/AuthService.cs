using DueDiligence.Core.DTOs;
using DueDiligence.Core.Interfaces;
using DueDiligence.Infrastructure.ExternalServices;
using Microsoft.AspNetCore.Http;

namespace DueDiligence.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AuthApiClient _authApiClient;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private string? _currentToken;

        public AuthService(AuthApiClient authApiClient, IHttpContextAccessor httpContextAccessor)
        {
            _authApiClient = authApiClient;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request)
        {
            var result = await _authApiClient.RegisterAsync(request);
            
            if (result.Success && result.Data?.Token != null)
            {
                SetCurrentToken(result.Data.Token);
            }
            
            return result;
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            var result = await _authApiClient.LoginAsync(request);
            
            if (result.Success && result.Data?.Token != null)
            {
                SetCurrentToken(result.Data.Token);
            }
            
            return result;
        }

        public async Task<LogoutResponseDTO> LogoutAsync(string token)
        {
            var result = await _authApiClient.LogoutAsync(token);
            
            if (result.Success)
            {
                SetCurrentToken(null);
            }
            
            return result;
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            return await _authApiClient.ValidateTokenAsync(token);
        }

        public string? GetCurrentToken()
        {
            // Try to get token from different sources
            // 1. From current instance
            if (!string.IsNullOrEmpty(_currentToken))
                return _currentToken;

            // 2. From HTTP context (Authorization header)
            var authHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                return authHeader.Substring("Bearer ".Length);
            }

            // 3. From session/cookies (if you implement them later)
            var sessionToken = _httpContextAccessor.HttpContext?.Session.GetString("JwtToken");
            if (!string.IsNullOrEmpty(sessionToken))
                return sessionToken;

            return null;
        }

        public void SetCurrentToken(string? token)
        {
            _currentToken = token;
            
            // Also store in session for persistence across requests
            if (_httpContextAccessor.HttpContext != null)
            {
                if (token != null)
                {
                    _httpContextAccessor.HttpContext.Session.SetString("JwtToken", token);
                }
                else
                {
                    _httpContextAccessor.HttpContext.Session.Remove("JwtToken");
                }
            }
        }
    }
}
