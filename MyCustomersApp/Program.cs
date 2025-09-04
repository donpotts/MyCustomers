using System;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MyCustomersApp;
using MudBlazor.Services;
using MyCustomersApp.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register the authenticated HTTP client handler (transient is recommended for DelegatingHandler)
builder.Services.AddTransient<AuthenticatedHttpClientHandler>();

// Register a named HttpClient "ApiClient" and attach the authenticated handler.
// Point this at the Web API host (not the Blazor WASM host) so API calls reach the server.
// TODO: consider moving this URL to configuration if it differs between environments.
var webApiBase = new Uri("https://localhost:7405/");
builder.Services.AddHttpClient("ApiClient", client =>
{
    client.BaseAddress = webApiBase;
}).AddHttpMessageHandler<AuthenticatedHttpClientHandler>();

// Public API client used for login/register (no auth handler attached)
// This must also target the Web API host so relative URIs like "api/identity/login" work.
builder.Services.AddHttpClient("PublicApiClient", client =>
{
    client.BaseAddress = webApiBase;
});

// Register the authenticated HTTP client as the default HttpClient via the factory
builder.Services.AddScoped<HttpClient>(sp =>
    sp.GetRequiredService<IHttpClientFactory>().CreateClient("ApiClient"));

builder.Services.AddMudServices(config =>
{
    config.SnackbarConfiguration.VisibleStateDuration = 1000;
    config.SnackbarConfiguration.RequireInteraction = false;
    config.SnackbarConfiguration.ShowCloseIcon = false;
});
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IThemeService, ThemeService>();

await builder.Build().RunAsync();
