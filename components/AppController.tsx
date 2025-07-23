import { MateriItem } from '@/constants/MateriData';
import { QuizSession } from '@/utils/QuizService';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { MatchingGameScreen } from './screens/MatchingGameScreen';
import { MateriDetailScreen } from './screens/MateriDetailScreen';
import { MateriScreen } from './screens/MateriScreen';
import { MenuScreen } from './screens/MenuScreen';
import { QuizHistoryScreen } from './screens/QuizHistoryScreen';
import { QuizResultsScreen } from './screens/QuizResultsScreen';
import { QuizScreen } from './screens/QuizScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

type AppState = 
  | 'welcome' 
  | 'menu' 
  | 'game' 
  | 'materi' 
  | 'materi-detail' 
  | 'assessment' 
  | 'quiz' 
  | 'quiz-results' 
  | 'quiz-history' 
  | 'leaderboard';

export const AppController: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('welcome');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [gameScore, setGameScore] = useState<number>(0);
  const [selectedMateri, setSelectedMateri] = useState<MateriItem | null>(null);
  const [currentQuizSession, setCurrentQuizSession] = useState<QuizSession | null>(null);

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleStart = () => {
    setCurrentScreen('menu');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu' as AppState);
    // Reset quiz session when going back to menu
    setCurrentQuizSession(null);
  };

  const handleMenuSelect = (menuId: string) => {
    switch (menuId) {
      case 'play':
        setCurrentScreen('game');
        break;
      case 'materi':
        setCurrentScreen('materi');
        break;
      case 'assessment':
        setCurrentScreen('assessment');
        break;
      case 'leaderboard':
        setCurrentScreen('leaderboard');
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

  // Assessment navigation handlers
  const handleStartQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = (quizSession: QuizSession) => {
    setCurrentQuizSession(quizSession);
    setCurrentScreen('quiz-results');
  };

  const handleBackFromQuiz = () => {
    setCurrentScreen('assessment');
  };

  const handleBackFromQuizResults = () => {
    setCurrentQuizSession(null);
    setCurrentScreen('assessment');
  };

  const handleViewQuizHistory = () => {
    setCurrentScreen('quiz-history');
  };

  const handleBackFromQuizHistory = () => {
    setCurrentScreen('assessment');
  };

  const handleViewQuizResult = (quizSession: QuizSession) => {
    setCurrentQuizSession(quizSession);
    setCurrentScreen('quiz-results');
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
      
      case 'assessment':
        return (
          <AssessmentScreen
            onBack={handleBackToMenu}
            onStartQuiz={handleStartQuiz}
            onViewHistory={handleViewQuizHistory}
          />
        );
      
      case 'quiz':
        return (
          <QuizScreen
            onBack={handleBackFromQuiz}
            onComplete={handleQuizComplete}
          />
        );
      
      case 'quiz-results':
        return currentQuizSession ? (
          <QuizResultsScreen
            quizSession={currentQuizSession}
            onBack={handleBackFromQuizResults}
            onBackToMenu={handleBackToMenu}
          />
        ) : (
          <AssessmentScreen
            onBack={handleBackToMenu}
            onStartQuiz={handleStartQuiz}
            onViewHistory={handleViewQuizHistory}
          />
        );
      
      case 'quiz-history':
        return (
          <QuizHistoryScreen
            onBack={handleBackFromQuizHistory}
            onViewQuizResult={handleViewQuizResult}
          />
        );
      
      case 'leaderboard':
        return (
          <LeaderboardScreen
            onBack={handleBackToMenu}
          />
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
}); 