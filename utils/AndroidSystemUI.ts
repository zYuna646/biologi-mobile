import * as SystemUI from 'expo-system-ui';
import { Platform, StatusBar } from 'react-native';

export class AndroidSystemUI {
  // Configure immersive mode for educational app
  static async configureImmersiveMode(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      // Configure system UI for educational app
      await SystemUI.setBackgroundColorAsync('transparent');
      
      // Set status bar to be immersive
      StatusBar.setHidden(false);
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent', true);
      
      console.log('✅ Android immersive mode configured successfully');
    } catch (error) {
      console.warn('⚠️ Android immersive mode configuration failed:', error);
    }
  }

  // Show status bar when needed
  static showStatusBar(): void {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      StatusBar.setHidden(false, 'slide');
      console.log('✅ Status bar shown');
    } catch (error) {
      console.warn('⚠️ Failed to show status bar:', error);
    }
  }

  // Hide status bar for immersive experience
  static hideStatusBar(): void {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      StatusBar.setHidden(true, 'slide');
      console.log('✅ Status bar hidden');
    } catch (error) {
      console.warn('⚠️ Failed to hide status bar:', error);
    }
  }

  // Set status bar style and color
  static setStatusBarStyle(style: 'default' | 'light-content' | 'dark-content', backgroundColor?: string): void {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      StatusBar.setBarStyle(style, true);
      if (backgroundColor) {
        StatusBar.setBackgroundColor(backgroundColor, true);
      }
      console.log(`✅ Status bar style set to: ${style}`);
    } catch (error) {
      console.warn('⚠️ Failed to set status bar style:', error);
    }
  }

  // Configure for educational content (full immersion)
  static async configureForEducation(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      // Configure for distraction-free learning
      await SystemUI.setBackgroundColorAsync('transparent');
      
      // Set status bar for educational mode
      this.setStatusBarStyle('dark-content', 'transparent');
      StatusBar.setTranslucent(true);
      
      console.log('🎓 Android configured for educational content');
    } catch (error) {
      console.warn('⚠️ Educational mode configuration failed:', error);
    }
  }

  // Restore normal Android UI (when exiting app)
  static async restoreNormalMode(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      this.showStatusBar();
      this.setStatusBarStyle('default', '#000000');
      console.log('🔄 Android UI restored to normal');
    } catch (error) {
      console.warn('⚠️ Failed to restore normal Android UI:', error);
    }
  }
} 