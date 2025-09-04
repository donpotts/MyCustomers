// web/index.js
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from '../App';

// Web-specific initialization
if (Platform.OS === 'web') {
  // For development, log info about HTTPS
  if (process.env.NODE_ENV === 'development') {
    console.info(
      '%c🔒 HTTPS Configuration 🔒',
      'background: #007bff; color: white; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    );
    console.info(
      '%cThis app is configured to use HTTPS for secure API communication.',
      'font-size: 12px; color: #333;'
    );
    
    // Display warning if not using HTTPS in development
    if (window.location.protocol !== 'https:') {
      console.warn(
        '%c⚠️ Not using HTTPS locally ⚠️\nSome features might not work properly without HTTPS.',
        'font-size: 12px; color: #f44336; font-weight: bold;'
      );
      console.info(
        'To enable HTTPS in development, see: https://create-react-app.dev/docs/using-https-in-development/'
      );
    } else {
      console.info(
        '%c✅ HTTPS is enabled',
        'font-size: 12px; color: #4caf50; font-weight: bold;'
      );
    }
  }

  // Apply web-specific styles to ensure proper scrolling
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    #root {
      display: flex;
      flex-direction: column;
    }
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
  `;
  document.head.appendChild(style);
}

// Register the main app component
registerRootComponent(App);
