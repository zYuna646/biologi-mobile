import { Config } from '@/constants/Config';
import { DeviceTokenManager } from './DeviceTokenManager';

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
  status: number;
}

export class UserService {
  private static readonly API_BASE = Config.API_URL;

  // Get device token using DeviceTokenManager
  static async getDeviceToken(): Promise<string> {
    return await DeviceTokenManager.getDeviceToken();
  }

  // Get user by device token
  static async getUserByDeviceToken(deviceToken: string): Promise<User | null> {
    try {
      console.log('👤 Fetching user by device token:', deviceToken);

      const response = await fetch(`${this.API_BASE}/users/device/${deviceToken}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (response.status === 404) {
        console.log('👤 User not found for device token');
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to fetch user. Status: ${response.status}, Error: ${errorText}`);
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const user: User = await response.json();
      console.log('✅ User fetched successfully:', user);
      return user;

    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  }

  // Create new user
  static async createUser(userData: Omit<User, 'id' | 'scores' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      // Validate device_token
      if (!userData.device_token || typeof userData.device_token !== 'string') {
        throw new Error('Device token must be a non-empty string');
      }

      console.log('👤 Creating new user:', {
        ...userData,
        device_token: `${userData.device_token} (type: ${typeof userData.device_token})`,
      });

      const response = await fetch(`${this.API_BASE}/users`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_token: String(userData.device_token).trim(),
          name: String(userData.name).trim(),
          class: String(userData.class).trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to create user. Status: ${response.status}, Error: ${errorText}`);
        console.error('📤 Request body that failed:', {
          device_token: String(userData.device_token).trim(),
          name: String(userData.name).trim(),
          class: String(userData.class).trim(),
        });
        throw new Error(`Failed to create user: ${response.status}`);
      }

      const user: User = await response.json();
      console.log('✅ User created successfully:', user);

      // Save device token to local storage after successful user creation
      await DeviceTokenManager.saveDeviceToken(userData.device_token);
      
      return user;

    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      console.log('👤 Updating user:', userId, userData);

      const response = await fetch(`${this.API_BASE}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to update user. Status: ${response.status}, Error: ${errorText}`);
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const user: User = await response.json();
      console.log('✅ User updated successfully:', user);
      return user;

    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }

  // Get current user (using stored device token)
  static async getCurrentUser(): Promise<User | null> {
    try {
      const deviceToken = await this.getDeviceToken();
      return await this.getUserByDeviceToken(deviceToken);
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  // Initialize user (check if exists, if not prepare for creation)
  static async initializeUser(): Promise<User | null> {
    try {
      const existingUser = await this.getCurrentUser();
      if (existingUser) {
        console.log('👤 Existing user found:', existingUser);
        return existingUser;
      }

      console.log('👤 No existing user found, will need to create profile');
      return null;

    } catch (error) {
      console.error('❌ Error initializing user:', error);
      return null;
    }
  }

  // Clear user data (for logout/reset)
  static async clearUserData(): Promise<void> {
    try {
      await DeviceTokenManager.clearDeviceToken();
      console.log('🗑️ User data cleared');
    } catch (error) {
      console.error('❌ Error clearing user data:', error);
    }
  }
} 