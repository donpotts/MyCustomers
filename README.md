## 🚀 My Customers

A modern, full-stack sample for customer management built with .NET, Blazor, Next.js, and React Native (Expo). This repository contains multiple projects that together demonstrate a production-ready architecture: API, web frontends, mobile client, infrastructure, and hosting orchestration.

---

## 🧭 Quick overview

- MyCustomers.AppHost — Aspire-based app host that can orchestrate the whole stack (Postgres, API, frontends) for local development and dashboarding.
- MyCustomers.WebApi — Minimal Web API (ASP.NET Core / .NET 9) exposing customer and identity endpoints.
- MyCustomers.Infrastructure & MyCustomers.Infrastructure.Persistence — EF Core persistence, repositories, DB context and mapping.
- MyCustomers.Application & MyCustomers.Application.Contracts — Application layer (services, DTOs) and contracts used by frontends.
- MyCustomersApp — Blazor WebAssembly front-end (MudBlazor) configured to talk to the Web API.
- MyCustomers.WebFrontend — Next.js (React) web frontend (TypeScript) used for modern SSR/SSG and NextAuth integration.
- MyCustomersRN — React Native (Expo) mobile client; also exposes a web dev server used by the AppHost dashboard.
- MyCustomers.ServiceDefaults — Shared service defaults: telemetry, health checks, service discovery, resilience.

---

## 🏗️ Architecture & patterns

- Clean layered architecture: Domain → Infrastructure → Application → WebApi / Frontends.
- Persistence: EF Core with PostgreSQL (see `MyCustomers.Infrastructure.Persistence/ApplicationDbContext.cs`).
- Authentication: ASP.NET Core Identity + JWT used by frontends (Blazor App registers HttpClients for authenticated and public API calls).
- Observability: OpenTelemetry instrumentation is configured in `MyCustomers.ServiceDefaults`.

---

## 🔌 Important HTTP endpoints

The projects use a set of conventional endpoints. The API includes (examples):

- POST /api/identity/login — authentication
- POST /api/identity/register — register
- GET /api/customers — list customers
- GET /api/customers/{id} — get a customer
- POST /api/customers — create
- PUT /api/customers/{id} — update
- DELETE /api/customers/{id} — delete

Refer to `MyCustomers.WebApi/Program.cs` for registrations, OpenAPI and how endpoints are mapped.

---

## 🧰 Tech stack

- Backend: .NET 9, ASP.NET Core Minimal APIs
- Persistence: Entity Framework Core, PostgreSQL
- Auth: ASP.NET Core Identity, JWT
- Frontend (web): Blazor WebAssembly (MudBlazor), Next.js + React
- Frontend (mobile): React Native (Expo)
- Orchestration & Local developer experience: Aspire AppHost (see `MyCustomers.AppHost`)
- Observability: OpenTelemetry

---

## ⚙️ Prerequisites

- .NET 9 SDK
- Node.js (18+) + npm or pnpm
- Docker (optional, recommended when using `MyCustomers.AppHost` to bring up Postgres via Aspire)
- Expo CLI (for running the RN app locally): npm i -g expo-cli (optional)

---

## ▶️ Recommended: Run the full stack with AppHost (Aspire)

The `MyCustomers.AppHost` project is configured to orchestrate Postgres, the Web API, and the frontends for a seamless local dev experience.

From the repo root (PowerShell / pwsh):

```powershell
dotnet run --project .\MyCustomers.AppHost\MyCustomers.AppHost.csproj
```

This will: create a local Postgres instance (with a `mycustomersdb` database), start the Web API, and expose the web frontends (Next.js, Expo web, and Blazor) in the Aspire dashboard.

Notes:
- The AppHost project will run npm install for local package.json files when needed (see the csproj Target).
- When developing without Docker/Aspire you can run projects individually (see below).

---

## ▶️ Run projects individually

Build the solution first:

```powershell
dotnet build .\MyCustomers.slnx
```

Run the Web API:

```powershell
dotnet run --project .\MyCustomers.WebApi\MyCustomers.WebApi.csproj
```

Run the Blazor WASM app (MyCustomersApp):

```powershell
dotnet run --project .\MyCustomersApp\MyCustomersApp.csproj
```

Run the Next.js frontend (MyCustomers.WebFrontend):

```powershell
cd .\MyCustomers.WebFrontend
npm install
npm run dev
```

Run the React Native (Expo) app (MyCustomersRN) — web or device:

```powershell
cd .\MyCustomersRN
npm install
npx expo start
```

If you run projects individually, ensure a PostgreSQL instance is available and connection strings are configured appropriately. The AppHost will create and wire up a Postgres instance automatically when used.

---

## 🧪 Tests & validation

This repository does not include a dedicated test project in the root. Use `dotnet build` to validate compilation across projects.

---

## 📁 Notable files

- `MyCustomers.AppHost/` — orchestration + local dev dashboard (Aspire)
- `MyCustomers.WebApi/Program.cs` — API bootstrap and endpoint mapping
- `MyCustomers.Infrastructure.Persistence/ApplicationDbContext.cs` — EF Core DB context
- `MyCustomersApp/Program.cs` — Blazor WASM host and HttpClient wiring
- `MyCustomers.WebFrontend/package.json` — Next.js frontend config
- `MyCustomersRN/package.json` — Expo React Native config

---

## 🧭 Next steps / developer tips

- Use `MyCustomers.AppHost` while onboarding a new machine — it wires up the DB and web apps for you.
- Review `Directory.Packages.props` for centralized NuGet versions.
- OpenTelemetry exporters can be enabled via environment variables (see `MyCustomers.ServiceDefaults`).

---

## 📫 Contact

For questions or help, reach out: Don.Potts@DonPotts.com
