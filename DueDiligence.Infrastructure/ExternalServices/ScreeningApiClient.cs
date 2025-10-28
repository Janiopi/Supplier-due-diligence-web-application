using System.Net.Http.Headers;
using System.Text.Json;
using DueDiligence.Core.DTOs;
using Microsoft.Extensions.Configuration;

namespace DueDiligence.Infrastructure.ExternalServices
{
    public class ScreeningApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly string _apiKey; // For JWT authentication

        public ScreeningApiClient(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["ExternalApis:ScreeningApi:BaseUrl"] ?? "http://localhost:3000/api";
            _apiKey = configuration["ExternalApis:ScreeningApi:ApiKey"] ?? "your-api-key";
        }

        private async Task<string> GetAuthTokenAsync()
        {
            // This would be replaced with your actual JWT authentication logic
            // For example, you might need to make a login request first
            
            // For now, we'll assume you already have the token
            return _apiKey;
        }

        public async Task<ScreeningResponseDTO> SearchEntityAsync(string entityName, List<string> sources)
        {
            // Get the JWT token
            string token = await GetAuthTokenAsync();
            
            // Set the token in the request header
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            
            // Build the query string
            string sourcesParam = sources.Any() ? $"&sources={string.Join(",", sources)}" : "";
            string url = $"{_baseUrl}/search?entityName={Uri.EscapeDataString(entityName)}{sourcesParam}";
            
            // Make the request
            HttpResponseMessage response = await _httpClient.GetAsync(url);
            
            // Check if request was successful
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"API returned status code {response.StatusCode}");
            }
            
            // Parse the response
            string jsonResponse = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<ApiResponseDTO>(jsonResponse, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            if (apiResponse == null || !apiResponse.Success)
            {
                throw new Exception("API returned an unsuccessful response");
            }
            
            return apiResponse.Data;
        }
    }

    // DTOs to match the API response structure
    public class ApiResponseDTO
    {
        public bool Success { get; set; }
        public ScreeningResponseDTO Data { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }

    public class ScreeningResponseDTO
    {
        public string SearchId { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string EntityName { get; set; } = string.Empty;
        public List<string> Sources { get; set; } = new();
        public List<SourceResultDTO> Results { get; set; } = new();
        public SummaryDTO Summary { get; set; } = new();
    }

    public class SourceResultDTO
    {
        public string Source { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public SourceDataDTO Data { get; set; } = new();
    }

    public class SourceDataDTO
    {
        public string Source { get; set; } = string.Empty;
        public int Count { get; set; }
        public List<object> Results { get; set; } = new();
    }

    public class SummaryDTO
    {
        public int Total { get; set; }
        public int Successful { get; set; }
        public int Failed { get; set; }
    }
}