using Microsoft.Extensions.Hosting;
using MyCustomers.AppHost;

var builder = DistributedApplication.CreateBuilder(args);

builder
    .AddDockerComposeEnvironment("env")
    .WithDashboard(dashboardBuilder =>
    {
        dashboardBuilder.WithExternalHttpEndpoints();
    });

var postgres = builder.AddPostgres("postgres", port: 61021).WithDataVolume();
var mycustomersdb = postgres.AddDatabase("mycustomersdb");

var webapi = builder
    .AddProject<Projects.MyCustomers_WebApi>("webapi")
    .WithHttpHealthCheck("/health")
    .WithReference(mycustomersdb)
    .WaitFor(mycustomersdb)
    .WithExternalHttpEndpoints();

var nextauthSecret = builder.AddParameter(
    "nextauth-secret",
    new GenerateParameterDefault { MinLength = 32, Special = false },
    secret: true,
    persist: true
);
var webfrontend = builder
    .AddNpmApp("webfrontend", "../MyCustomers.WebFrontend", "dev")
    .WithReference(webapi)
    .WaitFor(webapi)
    .WithEnvironment("NEXTAUTH_SECRET", nextauthSecret)
    .WithHttpEndpoint(3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

// Register the React Native (Expo) web project so Aspire exposes its URL/port in the dashboard.
// Expo web typically runs on port 19006 when using `expo start --web`.
var rnweb = builder
    .AddNpmApp("rnweb", "../MyCustomersRN", "web")
    .WithReference(webapi)
    .WaitFor(webapi)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(19006, env: "RCT_METRO_PORT")
    .WithExternalHttpEndpoints();

// Register the Blazor WebAssembly project so Aspire exposes its URL/port in the dashboard.
var webapp = builder.AddProject<Projects.MyCustomersApp>("webapp").WithExternalHttpEndpoints();

var launchProfile = builder.Configuration["DOTNET_LAUNCH_PROFILE"];
if (builder.Environment.IsDevelopment() && launchProfile == "https")
{
    webfrontend.RunWithHttpsDevCertificate("HTTPS_CERT_FILE", "HTTPS_CERT_KEY_FILE");
    // Also export the dev cert for the Blazor WASM project so it can run with HTTPS in Aspire.
    webapp.RunWithHttpsDevCertificate("HTTPS_CERT_FILE", "HTTPS_CERT_KEY_FILE");
    // Export the dev cert for the Expo web (rnweb) so it can run with HTTPS in Aspire when needed.
    rnweb.RunWithHttpsDevCertificate("HTTPS_CERT_FILE", "HTTPS_CERT_KEY_FILE");
}

builder.Build().Run();
