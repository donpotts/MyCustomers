import { User, CreateUserDto, UpdateUserDto, PagedResponse } from '../types/User';
import { apiClient } from './apiClient';

export class UserService {
  async getUsers(skip?: number, take?: number): Promise<User[]> {
    try {
      const params = new URLSearchParams();
      if (skip !== undefined) params.append('skip', skip.toString());
      if (take !== undefined) params.append('take', take.toString());
      
      const queryString = params.toString();
      const endpoint = queryString ? `/api/users?${queryString}` : '/api/users';
      
      const response = await apiClient.get<PagedResponse<User>>(endpoint);
      return response.items || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/api/users/${id}`);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      return await apiClient.post<User>('/api/users', userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      return await apiClient.put<User>(`/api/users/${id}`, userData);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>('/api/users/me');
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();