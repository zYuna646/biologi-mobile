import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export class DeviceTokenManager {
  private static readonly DEVICE_TOKEN_KEY = '@biologi_edukasi_device_token';

  // Generate a unique device token
  private static generateDeviceToken(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const platform = Platform.OS || 'unknown';
    const token = `${platform}_${timestamp}_${random}`;
    
    // Ensure token is valid and not empty
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      // Fallback to UUID-like format
      const fallbackToken = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      console.log('📱 Generated fallback device token:', fallbackToken);
      return fallbackToken;
    }
    
    console.log('📱 Generated device token:', token);
    return token;
  }

  // Get device token from local storage or generate new one
  static async getDeviceToken(): Promise<string> {
    try {
      // Try to get existing token from AsyncStorage
      const existingToken = await AsyncStorage.getItem(this.DEVICE_TOKEN_KEY);
      
      if (existingToken && typeof existingToken === 'string' && existingToken.trim().length > 0) {
        console.log('📱 Device token retrieved from storage:', existingToken);
        return existingToken.trim();
      }

      // If no valid token exists, try to use Expo constants as fallback
      let newToken: string;
      
      if (Constants.sessionId && typeof Constants.sessionId === 'string') {
        newToken = Constants.sessionId.trim();
      } else if (Constants.installationId && typeof Constants.installationId === 'string') {
        newToken = Constants.installationId.trim();
      } else {
        // Generate completely new token
        newToken = this.generateDeviceToken();
      }

      // Ensure token is valid string
      if (!newToken || typeof newToken !== 'string' || newToken.trim().length === 0) {
        newToken = this.generateDeviceToken();
      }

      // Save the new token to storage
      await this.saveDeviceToken(newToken);
      console.log('📱 New device token generated and saved:', newToken);
      return newToken;

    } catch (error) {
      console.error('❌ Error getting device token:', error);
      // Fallback to generated token if storage fails
      const fallbackToken = this.generateDeviceToken();
      console.log('📱 Using fallback token:', fallbackToken);
      return fallbackToken;
    }
  }

  // Save device token to local storage
  static async saveDeviceToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.DEVICE_TOKEN_KEY, token);
      console.log('✅ Device token saved to storage:', token);
    } catch (error) {
      console.error('❌ Error saving device token:', error);
    }
  }

  // Clear device token from local storage (for logout/reset)
  static async clearDeviceToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.DEVICE_TOKEN_KEY);
      console.log('🗑️ Device token cleared from storage');
    } catch (error) {
      console.error('❌ Error clearing device token:', error);
    }
  }

  // Check if device token exists in storage
  static async hasDeviceToken(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(this.DEVICE_TOKEN_KEY);
      return token !== null;
    } catch (error) {
      console.error('❌ Error checking device token:', error);
      return false;
    }
  }
} 