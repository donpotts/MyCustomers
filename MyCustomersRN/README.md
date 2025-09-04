# MyCustomers React Native App

A React Native client app built with Expo to perform CRUD operations against the MyCustomers API Server.

## Features

- **🔐 Authentication System**
  - User registration with email and password
  - User login with session management
  - Secure token-based authentication
  - Auto-logout and session protection

- **🎨 Modern UI Design**
  - **Light & Dark Mode Support** with theme toggle
  - **Side Navigation Drawer** matching the WASM app design
  - **Material Design 3** with React Native Paper
  - **Blue Theme** consistent with original app
  - Responsive design for all screen sizes

- **📊 Dashboard**
  - Welcome screen with user statistics
  - Customer count and metrics
  - Recent customers overview
  - Quick navigation to customer management

- **👥 Customer Management**
  - **Search Functionality** - search customers by name, email, phone, or notes
  - **Customer Cards** with avatars and detailed information
  - View list of customers with pull-to-refresh
  - Add new customers with form validation
  - Edit existing customers
  - Delete customers with confirmation
  - Customer profile pictures (initials-based)

- **👤 User Management**
  - View current user profile
  - User information display
  - Future-ready for multi-user management

- **🎯 Navigation**
  - **Drawer Navigation** with Dashboard, Customers, and Users sections
  - Modal screens for add/edit operations
  - Seamless navigation flow
  - Theme toggle in header

## Prerequisites

- Node.js (v18 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Your MyCustomers API Server running (typically at http://localhost:5000)

## Installation

1. Navigate to the project directory:
   ```bash
   cd MyCustomersRN
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Before running the app, make sure to update the API base URL in `src/services/apiClient.ts`:

```typescript
const API_BASE_URL = 'https://localhost:7488'; // Your API server URL
```

**Important Notes:**
- Use HTTPS (port 7488) for authentication to work properly
- For development on a physical device, you may need to use your computer's IP address instead of localhost
- Make sure your API server is configured to accept HTTPS requests

## Running the App

### Web
```bash
npm run web
```

### iOS Simulator (macOS only)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Physical Device
1. Install the Expo Go app from your device's app store
2. Run: `npm start`
3. Scan the QR code with the Expo Go app

## API Server Requirements

Make sure your MyCustomers API Server is running and accessible. The app expects the following endpoints:

### Authentication Endpoints
- `POST /api/identity/login` - User login
- `POST /api/identity/register` - User registration

### Customer Management Endpoints (Requires Authentication)
- `GET /api/customers` - Get all customers (with optional pagination)
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update existing customer
- `DELETE /api/customers/{id}` - Delete customer

**Note:** All customer endpoints require a valid Bearer token in the Authorization header.

## Project Structure

```
src/
├── screens/           # React Native screens
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── CustomerListScreen.tsx
│   ├── AddCustomerScreen.tsx
│   └── CustomerDetailScreen.tsx
├── services/          # API service layer
│   ├── apiClient.ts
│   ├── authService.ts
│   └── customerService.ts
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── types/            # TypeScript type definitions
│   ├── Auth.ts
│   └── Customer.ts
└── components/       # Reusable components (future expansion)
```

## Usage Flow

1. **🆕 First Time Users:**
   - Launch app → Register with email/password → Login → Dashboard

2. **🔄 Returning Users:**
   - Launch app → Login (or auto-login) → Dashboard

3. **🎛️ Navigation:**
   - **Hamburger Menu** → Access Dashboard, Customers, Users sections
   - **Theme Toggle** (🌙/☀️) → Switch between light/dark modes
   - **User Avatar** → View user info and logout

4. **📊 Dashboard:**
   - View customer statistics and metrics
   - See recent customers
   - Quick access to customer management

5. **👥 Customer Management:**
   - **Search Bar** → Find customers quickly
   - **ADD CUSTOMER** button → Create new customer
   - **Customer Cards** → Tap Edit/Delete buttons
   - **Pull-to-refresh** → Update customer list

6. **🔒 Security:**
   - Session management with automatic token handling
   - Logout from drawer menu
   - Authentication protection on all screens

## Dependencies

- **Expo** - React Native development platform
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **TypeScript** - Type safety

## Development Notes

- The app uses TypeScript for type safety
- React Native Paper provides Material Design components
- API calls are centralized in the services layer
- Error handling includes user-friendly alerts
- Form validation is implemented for required fields