// src/config/appConfig.ts
import { Platform } from 'react-native';

// Environment detection
const isWeb = Platform.OS === 'web';
const isDevelopment = process.env.NODE_ENV === 'development';

// API configuration
const getApiConfig = () => {
  // Development environment settings
  if (isDevelopment) {
    return {
      baseUrl: 'https://localhost:7405',
      useHttps: true,
      timeout: 30000, // 30 seconds
    };
  }
  
  // Production environment settings
  if (isWeb) {
    // For web deployments, API might be on the same domain
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    
    return {
      // In production, the API server might be behind a reverse proxy or on a different port
      baseUrl: `${protocol}//${hostname}:7405`,
      useHttps: protocol === 'https:',
      timeout: 15000, // 15 seconds
    };
  }
  
  // Default settings for mobile production
  return {
    baseUrl: 'https://api.mycustomers.com', // Replace with your production API URL
    useHttps: true,
    timeout: 15000, // 15 seconds
  };
};

// Application configuration
const appConfig = {
  api: getApiConfig(),
  
  // Authentication settings
  auth: {
    tokenStorageKey: 'auth_token',
    refreshTokenStorageKey: 'refresh_token',
    expirationStorageKey: 'token_expiration',
  },
  
  // Application settings
  app: {
    name: 'MyCustomers',
    version: '1.0.0',
    isWeb,
    isDevelopment,
  },
};

export default appConfig;
