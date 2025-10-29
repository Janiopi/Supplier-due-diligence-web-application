using DueDiligence.Core.DTOs;
using DueDiligence.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DueDiligence.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register(RegisterRequestDTO request)
        {
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

            var result = await _authService.RegisterAsync(request);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginRequestDTO request)
        {
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

            var result = await _authService.LoginAsync(request);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return Unauthorized(result);
        }

        [HttpPost("logout")]
        public async Task<ActionResult<LogoutResponseDTO>> Logout()
        {
            var token = _authService.GetCurrentToken();
            
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { Message = "No active session found" });
            }

            var result = await _authService.LogoutAsync(token);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpGet("validate")]
        public async Task<ActionResult> ValidateToken()
        {
            var token = _authService.GetCurrentToken();
            
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { Message = "No token provided" });
            }

            var isValid = await _authService.ValidateTokenAsync(token);
            
            if (isValid)
            {
                return Ok(new { Message = "Token is valid", Valid = true });
            }
            
            return Unauthorized(new { Message = "Token is invalid", Valid = false });
        }
    }
}
