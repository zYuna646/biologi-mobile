import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MatchingGameScreen } from './screens/MatchingGameScreen';
import { MenuScreen } from './screens/MenuScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

type AppState = 'welcome' | 'menu' | 'game' | 'materi' | 'leaderboard';

export const AppController: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('welcome');
  const [gameScore, setGameScore] = useState<number>(0);  

  const handleStart = () => {
    setCurrentScreen('menu');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu' as AppState);
  };

  const handleMenuSelect = (menuId: string) => {
    switch (menuId) {
      case 'play':
        setCurrentScreen('game');
        break;
      case 'materi':
        setCurrentScreen('materi');
        // TODO: Navigate to materi screen
        console.log('Navigating to Materi');
        setTimeout(() => setCurrentScreen('menu'), 1000);
        break;
      case 'leaderboard':
        setCurrentScreen('leaderboard');
        // TODO: Navigate to leaderboard screen
        console.log('Navigating to Leaderboard');
        setTimeout(() => setCurrentScreen('menu'), 1000);
        break;
      default:
        console.log('Unknown menu:', menuId);
    }
  };

  const handleGameComplete = (score: number) => {
    setGameScore(score);
    setCurrentScreen('menu');
    // TODO: Save score to leaderboard
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'menu':
        return (
          <MenuScreen
            onTopicSelect={handleMenuSelect}
            onBack={handleBackToWelcome}
          />
        );
      case 'game':
        return (
          <MatchingGameScreen
            onBack={handleBackToMenu}
            onGameComplete={handleGameComplete}
          />
        );
      case 'materi':
      case 'leaderboard':
        // Placeholder for future screens
        return (
          <View style={styles.placeholder}>
            {/* Placeholder for future content */}
          </View>
        );
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return <View style={styles.container}>{renderCurrentScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 