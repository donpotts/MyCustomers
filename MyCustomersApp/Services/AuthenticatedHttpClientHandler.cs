using Microsoft.JSInterop;

namespace MyCustomersApp.Services;

public class AuthenticatedHttpClientHandler : DelegatingHandler
{
    private readonly IJSRuntime _jsRuntime;
    private readonly ILogger<AuthenticatedHttpClientHandler> _logger;

    public AuthenticatedHttpClientHandler(IJSRuntime jsRuntime, ILogger<AuthenticatedHttpClientHandler> logger)
    {
        _jsRuntime = jsRuntime;
        _logger = logger;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        try
        {
            var token = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "authToken");
            if (!string.IsNullOrEmpty(token))
            {
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                _logger.LogDebug("Added Bearer token to request: {Method} {Uri}", request.Method, request.RequestUri);
            }
            else
            {
                _logger.LogDebug("No auth token found for request: {Method} {Uri}", request.Method, request.RequestUri);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error getting auth token for request: {Method} {Uri}", request.Method, request.RequestUri);
        }

        var response = await base.SendAsync(request, cancellationToken);
        
        if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
        {
            _logger.LogWarning("Unauthorized response received for: {Method} {Uri}", request.Method, request.RequestUri);
        }
        
        return response;
    }
}