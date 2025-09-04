// src/utils/webSetup.ts
import appConfig from '../config/appConfig';

/**
 * This function sets up the web environment for the React Native Web app
 * It's meant to be called once during app initialization
 */
export const setupWebEnvironment = (): void => {
  if (!appConfig.app.isWeb) {
    return; // Only run in web environments
  }
  
  // Force HTTPS in production environments
  if (!appConfig.app.isDevelopment && window.location.protocol === 'http:') {
    window.location.href = window.location.href.replace('http:', 'https:');
    return;
  }
  
  // Log environment information for debugging
  console.info(`Running in ${appConfig.app.isDevelopment ? 'development' : 'production'} mode`);
  console.info(`API server: ${appConfig.api.baseUrl} (HTTPS: ${appConfig.api.useHttps ? 'enabled' : 'disabled'})`);
  
  // Handle page visibility changes for better user experience
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // When page becomes visible again, check if user is still authenticated
      import('../services/authService').then(({ authService }) => {
        authService.getAuthToken().then(token => {
          if (!token) {
            console.log('User session expired, redirecting to login');
            window.location.href = '/login';
          }
        });
      });
    }
  });
  
  // Add viewport meta tag for better mobile responsiveness
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  (viewport as HTMLMetaElement).content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  
  // Add custom styles for web
  const style = document.createElement('style');
  style.textContent = `
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    html, body, #root {
      height: 100%;
      overflow: hidden;
      -webkit-text-size-adjust: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Better mobile touch handling */
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* Allow text selection on inputs and text areas */
    input, textarea {
      -webkit-user-select: text;
      user-select: text;
    }
    
    /* Improve mobile drawer performance */
    @media (max-width: 768px) {
      body {
        position: fixed;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }
    }
  `;
  document.head.appendChild(style);
};

export default setupWebEnvironment;
