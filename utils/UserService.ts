import { Config } from '@/constants/Config';
import Constants from 'expo-constants';

export interface User {
  id?: number;
  device_token: string;
  name: string;
  class: string;
  scores?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export class UserService {
  private static readonly API_BASE = Config.API_URL;

  // Get device unique identifier
  static getDeviceToken(): string {
    return Constants.sessionId || Constants.installationId || `device_${Date.now()}`;
  }

  // Check if user exists by device token
  static async getUserByDeviceToken(deviceToken: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.API_BASE}/users/device/${deviceToken}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (response.status === 404) {
        return null; // User not found
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Create new user
  static async createUser(userData: Omit<User, 'id' | 'scores' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE}/users`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      const user: User = await response.json();
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Get current user (checks by device token)
  static async getCurrentUser(): Promise<User | null> {
    const deviceToken = this.getDeviceToken();
    return await this.getUserByDeviceToken(deviceToken);
  }

  // Initialize user (get existing or prompt for creation)
  static async initializeUser(): Promise<User | null> {
    try {
      const existingUser = await this.getCurrentUser();
      return existingUser;
    } catch (error) {
      console.error('Error initializing user:', error);
      return null;
    }
  }
} 