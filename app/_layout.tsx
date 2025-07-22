import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AndroidSystemUI } from '@/utils/AndroidSystemUI';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      
      // Configure Android System UI (hide navigation and status bar)
      if (Platform.OS === 'android') {
        configureAndroidSystemUI();
      }
    }
  }, [loaded]);

  const configureAndroidSystemUI = async () => {
    try {
      // Configure Android for educational content
      await AndroidSystemUI.configureForEducation();
      
      console.log('🎓 Android configured for educational experience');
    } catch (error) {
      console.log('Android System UI configuration error:', error);
    }
  };

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar 
        style={Platform.OS === 'android' ? 'dark' : 'auto'} 
        backgroundColor="transparent" 
        translucent={Platform.OS === 'android'}
        hidden={false}
      />
    </ThemeProvider>
  );
}
