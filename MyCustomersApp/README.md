# My Customers WASM Application

A modern Blazor WebAssembly application for customer management built with MudBlazor components.

## Features

### 🔐 Authentication
- **User Registration**: Create new accounts with first name, last name, email, and password
- **User Login**: Secure login with email and password
- **Session Management**: Automatic token handling with localStorage persistence

### 🎨 Theme Support
- **Light/Dark Mode**: Toggle between light and dark themes
- **Theme Persistence**: User preference saved in localStorage
- **Material Design**: Modern MudBlazor components with custom color schemes

### 👥 Customer Management
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Modern UI**: 
  - Grid view and Card view toggle
  - Search and filtering capabilities
  - Responsive design for all screen sizes
- **Customer Fields**:
  - First Name & Last Name
  - Email Address
  - Phone Number
  - Street Address, City, State, Zip Code
  - Created/Modified timestamps

### 📊 Dashboard
- **Statistics Cards**: Total customers, new customers this month, active customers, growth rate
- **Recent Customers**: Quick view of the 5 most recently added customers
- **Quick Actions**: Direct links to add customers or view all customers

### 🔔 User Experience
- **Snackbar Notifications**: Success and error messages for all operations
- **Loading States**: Progress indicators for all async operations
- **Form Validation**: Client-side validation with clear error messages
- **Delete Confirmations**: Confirmation dialogs with customer names for safety

## API Integration

The application is configured to connect to the backend API at `https://localhost:7488/` with the following endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get specific customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update existing customer
- `DELETE /api/customers/{id}` - Delete customer

## Running the Application

1. Ensure your backend API is running on `https://localhost:7488/`
2. Navigate to the MyCustomersApp directory
3. Run: `dotnet run`
4. Open your browser to the displayed local URL

## Technologies Used

- **Blazor WebAssembly** - Client-side web framework
- **MudBlazor 8.11.0** - Material Design component library
- **.NET 9** - Latest .NET framework
- **C# 12** - Programming language
- **HttpClient** - API communication
- **LocalStorage** - Client-side data persistence

## Project Structure

```
MyCustomersApp/
├── Components/           # Reusable components
├── Layout/              # Application layout components
├── Models/              # Data transfer objects
├── Pages/               # Razor page components
├── Services/            # Business logic and API services
└── wwwroot/             # Static web assets
```

## Security Features

- **JWT Token Authentication**: Automatic JWT token handling for all API calls
- **Token Management**: Secure token storage in localStorage with automatic header injection
- **Endpoint Security**: 
  - **Login/Register**: Uses public HTTP client (no authentication required)
  - **All other endpoints**: Automatically includes JWT token in Authorization header
- **Secure Password Handling**: Client-side password validation
- **Automatic Logout**: Token removal and state cleanup on logout
- **Protected Routes**: Authentication-based navigation and UI elements
- **Input Validation**: Client-side form validation and sanitization

## JWT Token Implementation

The application implements a robust JWT authentication system:

1. **Login/Register**: Uses `PublicApiClient` for unauthenticated endpoints
2. **All Customer Operations**: Uses `ApiClient` with `AuthenticatedHttpClientHandler`
3. **Automatic Token Injection**: The `AuthenticatedHttpClientHandler` automatically adds the JWT token from localStorage to every API request
4. **Token Persistence**: JWT tokens are stored in localStorage and persist across browser sessions
5. **Clean Logout**: Removes tokens and clears authentication state on logout

### HTTP Client Configuration:
- `PublicApiClient`: For `/api/auth/login` and `/api/auth/register` (no auth required)
- `ApiClient`: For all other endpoints (includes JWT token automatically)

The application provides a complete, modern customer management solution with a focus on user experience, security, and responsive design.