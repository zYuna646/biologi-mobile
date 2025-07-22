import { MateriItem } from '@/constants/MateriData';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MatchingGameScreen } from './screens/MatchingGameScreen';
import { MateriDetailScreen } from './screens/MateriDetailScreen';
import { MateriScreen } from './screens/MateriScreen';
import { MenuScreen } from './screens/MenuScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

type AppState = 'welcome' | 'menu' | 'game' | 'materi' | 'materi-detail' | 'leaderboard';

export const AppController: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('welcome');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [gameScore, setGameScore] = useState<number>(0);
  const [selectedMateri, setSelectedMateri] = useState<MateriItem | null>(null);

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleStart = () => {
    setCurrentScreen('menu');
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

  const handleMateriSelect = (materi: MateriItem) => {
    setSelectedMateri(materi);
    setCurrentScreen('materi-detail');
  };

  const handleBackFromMateriDetail = () => {
    setSelectedMateri(null);
    setCurrentScreen('materi');
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
        return (
          <MateriScreen
            onBack={handleBackToMenu}
            onMateriSelect={handleMateriSelect}
          />
        );
      case 'materi-detail':
        return selectedMateri ? (
          <MateriDetailScreen
            materi={selectedMateri}
            onBack={handleBackFromMateriDetail}
          />
        ) : (
          <MateriScreen
            onBack={handleBackToMenu}
            onMateriSelect={handleMateriSelect}
          />
        );
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

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
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