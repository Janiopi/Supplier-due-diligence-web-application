using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using DueDiligence.Core.DTOs;
using Microsoft.Extensions.Configuration;

namespace DueDiligence.Infrastructure.ExternalServices
{
    public class AuthApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public AuthApiClient(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ExternalApis:AuthApi:BaseUrl"] ?? "http://localhost:3000/auth";
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request)
        {
            var json = JsonSerializer.Serialize(new
            {
                username = request.Username,
                email = request.Email,
                password = request.Password
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{_baseUrl}/register", content);

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<AuthResponseDTO>(responseJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new AuthResponseDTO { Success = false, Message = "Invalid response from server" };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            var json = JsonSerializer.Serialize(new
            {
                email = request.Email,
                password = request.Password
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{_baseUrl}/login", content);

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<AuthResponseDTO>(responseJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new AuthResponseDTO { Success = false, Message = "Invalid response from server" };
        }

        public async Task<LogoutResponseDTO> LogoutAsync(string token)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            
            var response = await _httpClient.PostAsync($"{_baseUrl}/logout", null);

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<LogoutResponseDTO>(responseJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new LogoutResponseDTO { Success = false, Message = "Invalid response from server" };
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                
                // Try to access a protected endpoint to validate the token
                var response = await _httpClient.GetAsync("http://localhost:3000/api/search?entityName=test");
                
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
    }
}
