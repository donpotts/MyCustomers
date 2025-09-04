import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, RegisterRequest, AuthResponse, UserInfo } from '../types/Auth';
import { apiClient } from './apiClient';

export class AuthService {
  private static instance: AuthService;
  private currentUser: UserInfo | null = null;
  private authListeners: ((isAuthenticated: boolean, user: UserInfo | null) => void)[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Add auth state change listener
  addAuthListener(listener: (isAuthenticated: boolean, user: UserInfo | null) => void) {
    this.authListeners.push(listener);
  }

  // Remove auth state change listener
  removeAuthListener(listener: (isAuthenticated: boolean, user: UserInfo | null) => void) {
    this.authListeners = this.authListeners.filter(l => l !== listener);
  }

  // Notify all listeners of auth state change
  private notifyAuthChange() {
    const isAuthenticated = this.currentUser !== null;
    this.authListeners.forEach(listener => listener(isAuthenticated, this.currentUser));
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const loginData = { email, password };
      
      const response = await fetch(`${apiClient.baseURL}/api/identity/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const result = await response.json();
        const accessToken = result.accessToken;
        
        if (accessToken) {
          const user: UserInfo = {
            id: result.id || new Date().getTime().toString(),
            email: email,
            firstName: result.firstName || '',
            lastName: result.lastName || '',
          };

          // Store token and user info
          await AsyncStorage.setItem('authToken', accessToken);
          await AsyncStorage.setItem('userInfo', JSON.stringify(user));
          
          this.currentUser = user;
          this.notifyAuthChange();

          return {
            success: true,
            token: accessToken,
            user: user,
          };
        }
      }

      const errorText = await response.text();
      return {
        success: false,
        message: `Login failed: ${errorText}`,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed due to network error',
      };
    }
  }

  async register(userData: Omit<RegisterRequest, 'confirmPassword'>): Promise<AuthResponse> {
    try {
      const registerData = {
        email: userData.email,
        password: userData.password,
      };

      const response = await fetch(`${apiClient.baseURL}/api/identity/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        const user: UserInfo = {
          id: new Date().getTime().toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        };

        // Store registered user info for later use
        await this.storeRegisteredUser(user);

        return {
          success: true,
          message: 'Registration successful. Please log in.',
          user: user,
        };
      }

      const errorText = await response.text();
      return {
        success: false,
        message: `Registration failed: ${errorText}`,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed due to network error',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      this.currentUser = null;
      this.notifyAuthChange();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<UserInfo | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const userInfoJson = await AsyncStorage.getItem('userInfo');
      if (userInfoJson) {
        this.currentUser = JSON.parse(userInfoJson);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }

    return this.currentUser;
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async storeRegisteredUser(user: UserInfo): Promise<void> {
    try {
      const registeredUsersJson = await AsyncStorage.getItem('registeredUsers');
      let registeredUsers: UserInfo[] = [];

      if (registeredUsersJson) {
        registeredUsers = JSON.parse(registeredUsersJson);
      }

      // Add user if not already exists
      const existingUser = registeredUsers.find(u => 
        u.email.toLowerCase() === user.email.toLowerCase()
      );

      if (!existingUser) {
        registeredUsers.push(user);
        await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
    } catch (error) {
      console.error('Error storing registered user:', error);
    }
  }
}

export const authService = AuthService.getInstance();