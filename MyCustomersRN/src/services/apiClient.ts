import appConfig from '../config/appConfig';

// Get API configuration from centralized config
const API_BASE_URL = appConfig.api.baseUrl;
const isWeb = appConfig.app.isWeb;

export class ApiClient {
  public baseURL: string;
  public isConnected: boolean = true;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    
    // For web environments, periodically check server availability
    if (isWeb) {
      this.checkServerAvailability();
      setInterval(() => this.checkServerAvailability(), 30000); // Check every 30 seconds
    }
  }
  
  // Helper to check server availability
  private async checkServerAvailability(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout for health check
      
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      this.isConnected = response.ok;
    } catch (error) {
      this.isConnected = false;
      console.warn('API server health check failed:', error);
    }
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from AsyncStorage
    const authService = (await import('./authService')).authService;
    const token = await authService.getAuthToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
      // For web environments, ensure we're using proper credentials handling
      credentials: isWeb ? 'include' : 'same-origin',
    };

    try {
      // Create an AbortController with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), appConfig.api.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);

      // Handle different types of errors
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          console.warn('Authentication error, redirecting to login');
          // In web environments, redirect to login
          if (isWeb && typeof window !== 'undefined') {
            window.location.href = '/login';
            return {} as T;
          }
          throw new Error('Authentication error');
        }
        
        // Handle other API errors
        const errorText = await response.text();
        let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        
        try {
          // Try to parse the error as JSON for more details
          const errorJson = JSON.parse(errorText);
          if (errorJson.message || errorJson.error) {
            errorMessage = errorJson.message || errorJson.error;
          }
        } catch (e) {
          // If parsing fails, use the raw text if available
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Handle no content responses (like DELETE)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API request error for ${endpoint}:`, error);
      
      // Handle timeout errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout: The server took too long to respond (>${appConfig.api.timeout / 1000}s)`);
      }
      
      // Handle network errors
      if (!navigator.onLine && isWeb) {
        throw new Error('Network error: Please check your internet connection');
      }
      
      // Handle other errors
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();