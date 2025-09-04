export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  user?: UserInfo;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: Omit<RegisterRequest, 'confirmPassword'>) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}