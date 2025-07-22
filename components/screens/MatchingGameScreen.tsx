import { UserScoreHistoryModal } from '@/components/screens/UserScoreHistoryModal';
import { GameButton } from '@/components/ui/GameButton';
import { SimpleMatchCard } from '@/components/ui/SimpleMatchCard';
import { Config } from '@/constants/Config';
import { Card, GAME_ITEMS, GAME_SETTINGS } from '@/constants/GameData';
import { ScoreService } from '@/utils/ScoreService';
import { soundManager } from '@/utils/SoundManager';
import { UserService } from '@/utils/UserService';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MatchingGameScreenProps {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

const { width, height } = Dimensions.get('window');

export const MatchingGameScreen: React.FC<MatchingGameScreenProps> = ({ 
  onBack, 
  onGameComplete 
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(GAME_SETTINGS.INITIAL_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);
  const [scorePopup, setScorePopup] = useState<{show: boolean, amount: number, isPositive: boolean}>({
    show: false,
    amount: 0,
    isPositive: true
  });
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [showScoreHistory, setShowScoreHistory] = useState(false);

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  // Animation values - separate for different native driver usage
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;
  const scorePopupAnim = useRef(new Animated.Value(0)).current;
  // Background color animation uses non-native driver
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;

  // Initialize sound system
  useEffect(() => {
    const initializeSounds = async () => {
      await soundManager.initializeSounds();
      soundManager.setMuted(isMuted);
    };
    initializeSounds();

    return () => {
      soundManager.cleanup();
    };
  }, []);

  // Mute/unmute sounds
  useEffect(() => {
    soundManager.setMuted(isMuted);
    if (!isMuted && gameStarted) {
      soundManager.playBackgroundMusic();
    } else {
      soundManager.stopBackgroundMusic();
    }
  }, [isMuted, gameStarted]);

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate cards for current level
  const generateLevelCards = useCallback((currentLevel: number) => {
    const gameCards: Card[] = [];
    
    // For higher levels, add more items or repeat items with different functions
    const itemsToUse = [...GAME_ITEMS];
    
    // Add more challenge for higher levels by including more pairs
    if (currentLevel > 1) {
      // Add extra items or create variations
      const extraItems = GAME_ITEMS.slice(0, Math.min(currentLevel - 1, 2));
      itemsToUse.push(...extraItems);
    }
    
    // Create image cards with unique content IDs for duplicates
    itemsToUse.forEach((item, index) => {
      gameCards.push({
        id: `image_${item.id}_${currentLevel}_${index}`,
        type: 'image',
        content: {
          ...item,
          id: `${item.id}_${currentLevel}_${index}`, // Make content ID unique for duplicates
        },
        isMatched: false,
        isSelected: false,
      });
    });

    // Create function cards with matching unique content IDs
    itemsToUse.forEach((item, index) => {
      gameCards.push({
        id: `function_${item.id}_${currentLevel}_${index}`,
        type: 'function',
        content: {
          ...item,
          id: `${item.id}_${currentLevel}_${index}`, // Same unique ID as matching image
        },
        isMatched: false,
        isSelected: false,
      });
    });

    return shuffleArray(gameCards);
  }, []);

  // Initialize game
  const initializeGame = useCallback(async () => {
    const levelCards = generateLevelCards(1);
    setCards(levelCards);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setScore(0);
    setCombo(0);
    setLevel(1);
    setTotalMatches(0);
    setTimeRemaining(GAME_SETTINGS.INITIAL_TIME);
    setGameStarted(true);
    setGameEnded(false);

    // Start background music
    if (!isMuted) {
      await soundManager.playBackgroundMusic();
    }

    // Background pulse animation - separate from other animations
    const backgroundAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColorAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColorAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );
    backgroundAnimation.start();
  }, [isMuted]);

  // Timer effect with warning animation
  useEffect(() => {
    if (gameStarted && !gameEnded && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        
        // Play tick sound when time is running low
        if (timeRemaining <= 30 && !isMuted) {
          soundManager.playSound('tick', 0.3);
        }

        // Pulse animation for low time - only if not already animating
        if (timeRemaining <= 30) {
          const pulseAnimation = Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]);
          pulseAnimation.start();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining <= 0 && gameStarted) {
      endGameCompletely();
    }
  }, [timeRemaining, gameStarted, gameEnded, isMuted]);

  // Handle card selection
  const handleCardPress = useCallback((card: Card) => {
    if (selectedCards.length >= 2 || card.isSelected || card.isMatched) {
      return;
    }

    const newSelectedCards = [...selectedCards, card];
    setSelectedCards(newSelectedCards);

    // Update card selection state
    setCards(prevCards => 
      prevCards.map(c => 
        c.id === card.id ? { ...c, isSelected: true } : c
      )
    );

    // Check for match when 2 cards are selected
    if (newSelectedCards.length === 2) {
      setTimeout(() => {
        checkMatch(newSelectedCards);
      }, 1000);
    }
  }, [selectedCards]);

  // Check if selected cards match
  const checkMatch = useCallback(async (selectedCards: Card[]) => {
    const [card1, card2] = selectedCards;
    const isMatch = card1.content.id === card2.content.id && card1.type !== card2.type;

    if (isMatch) {
      // Match found - play success sound
      await soundManager.playSound('cardMatch', 0.7);

      const newMatchedPairs = new Set(matchedPairs);
      newMatchedPairs.add(card1.content.id);
      setMatchedPairs(newMatchedPairs);

      // Increase combo
      const newCombo = combo + 1;
      setCombo(newCombo);

      // Calculate score with time bonus and combo multiplier
      const timeBonus = Math.floor(timeRemaining / 10) * GAME_SETTINGS.TIME_BONUS_MULTIPLIER;
      const comboMultiplier = Math.min(newCombo, 5); // Max 5x combo
      const scoreIncrease = (GAME_SETTINGS.POINTS_PER_MATCH + timeBonus) * comboMultiplier;
      const newScore = score + scoreIncrease;
      setScore(newScore);

      // Show positive score popup
      setScorePopup({ show: true, amount: scoreIncrease, isPositive: true });
      const scorePopupAnimation = Animated.sequence([
        Animated.timing(scorePopupAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scorePopupAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]);
      scorePopupAnimation.start(() => {
        setScorePopup({ show: false, amount: 0, isPositive: true });
      });

      // Score animation - separate animation calls to avoid conflicts
      const scoreAnimation = Animated.sequence([
        Animated.timing(scoreAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scoreAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
      scoreAnimation.start();

      // Combo animation - separate animation calls
      if (newCombo > 1) {
        const comboAnimation = Animated.sequence([
          Animated.spring(comboAnim, {
            toValue: 1,
            tension: 50,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(comboAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]);
        comboAnimation.start();
      }

      // Update only the specific matched cards
      setCards(prevCards => 
        prevCards.map(c => {
          if (c.id === card1.id || c.id === card2.id) {
            return { ...c, isMatched: true, isSelected: false };
          }
          return { ...c, isSelected: false };
        })
      );

      // Update total matches count
      const newTotalMatches = totalMatches + 1;
      setTotalMatches(newTotalMatches);

      // Check if current level is complete
      const currentLevelPairs = Math.floor(cards.length / 2);
      if (newMatchedPairs.size >= currentLevelPairs) {
        setTimeout(() => {
          startNextLevel(newScore);
        }, 1500);
      }
    } else {
      // No match - play wrong sound, reset combo, and reduce score
      await soundManager.playSound('cardWrong', 0.5);
      setCombo(0);
      
      const scoreDecrease = GAME_SETTINGS.PENALTY_WRONG_MATCH;
      setScore(prev => prev - scoreDecrease);
      
      // Show negative score popup
      setScorePopup({ show: true, amount: scoreDecrease, isPositive: false });
      const scorePopupAnimation = Animated.sequence([
        Animated.timing(scorePopupAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scorePopupAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]);
      scorePopupAnimation.start(() => {
        setScorePopup({ show: false, amount: 0, isPositive: true });
      });
      
      setCards(prevCards => 
        prevCards.map(c => ({ ...c, isSelected: false }))
      );
    }

    setSelectedCards([]);
  }, [matchedPairs, score, timeRemaining, combo, totalMatches, cards.length]);

  // Start next level automatically
  const startNextLevel = useCallback(async (currentScore: number) => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    
    // Play level complete sound
    await soundManager.playSound('gameComplete', 0.6);
    
    // Small delay to show completion, then auto-continue
    setTimeout(() => {
      // Generate new cards for next level
      const newCards = generateLevelCards(nextLevel);
      setCards(newCards);
      setSelectedCards([]);
      setMatchedPairs(new Set());
      setCombo(0);
      
      // Add time bonus for completing level
      const timeBonus = 30;
      setTimeRemaining(prev => prev + timeBonus);
    }, 800);
  }, [level, generateLevelCards]);

  // End game completely (when time runs out or player chooses to quit)
  const endGameCompletely = useCallback(async (finalScore?: number) => {
    setGameEnded(true);
    const gameScore = finalScore || score;
    
    // Stop background music and play completion sound
    await soundManager.stopBackgroundMusic();
    await soundManager.playSound('gameComplete', 0.8);
    
    // Save score to API
    await saveScoreToAPI(gameScore);
    
    setTimeout(() => {
      Alert.alert(
        'Game Selesai! 🎉',
        `Skor Akhir: ${gameScore}\nLevel Tercapai: ${level}\nTotal Pasangan: ${totalMatches}\nKombo Tertinggi: ${combo}\n\n✅ Skor telah disimpan!`,
        [
          { text: 'Main Lagi', onPress: initializeGame },
          { text: 'Kembali', onPress: () => onGameComplete(gameScore) }
        ]
      );
    }, 500);
  }, [score, level, totalMatches, combo, initializeGame, onGameComplete]);

  // Save score to API
  const saveScoreToAPI = useCallback(async (finalScore: number) => {
    try {
      setIsSavingScore(true);
      
      // Get current user
      const currentUser = await UserService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        console.warn('⚠️ No user found, cannot save score');
        return;
      }

      // Create score data
      const scoreData = ScoreService.createScoreData(finalScore, level, currentUser.id);
      
      // Post score to API
      const result = await ScoreService.postScore(scoreData);
      
      if (result) {
        console.log('✅ Score saved successfully to API');
      } else {
        console.warn('⚠️ Failed to save score to API');
      }
      
    } catch (error) {
      console.error('❌ Error saving score:', error);
    } finally {
      setIsSavingScore(false);
    }
  }, [level]);

  // Handle back button with warning if game is in progress
  const handleBack = useCallback(() => {
    if (gameStarted && !gameEnded) {
      // Game is in progress, show warning
      setShowExitWarning(true);
    } else {
      // Game not started or already ended, safe to go back
      onBack();
    }
  }, [gameStarted, gameEnded, onBack]);

  // Handle exit game without saving
  const handleExitWithoutSaving = useCallback(() => {
    setShowExitWarning(false);
    onBack();
  }, [onBack]);

  // Handle continue game
  const handleContinueGame = useCallback(() => {
    setShowExitWarning(false);
  }, []);



  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const animatedBackgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Config.GAME_THEME.BACKGROUND, '#F0F8F0'],
  });

  // Calculate number of columns based on screen size
  const getColumnsCount = () => {
    if (isTablet) return 5;
    if (isSmallScreen) return 3;
    return 4;
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: animatedBackgroundColor }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <GameButton
              title="◀"
              onPress={handleBack}
              variant="secondary"
              size="small"
            />
            <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
              <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🔊'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowScoreHistory(true)} 
              style={styles.historyButton}
            >
              <Text style={styles.historyIcon}>📊</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.levelText, {
              fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
            }]}>
              📊 Level {level}
            </Text>
            <Text style={[styles.progressText, {
              fontSize: isTablet ? 14 : isSmallScreen ? 10 : 12,
            }]}>
              {matchedPairs.size}/{Math.floor(cards.length / 2)}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <Animated.View style={[
              styles.timeContainer,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}>
              <Text style={[styles.timeText, {
                fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                color: timeRemaining < 30 ? '#FF5252' : Config.GAME_THEME.TEXT_PRIMARY,
              }]}>
                ⏰ {formatTime(timeRemaining)}
              </Text>
            </Animated.View>
            
            <Animated.View style={[
              styles.scoreContainer,
              {
                transform: [{ scale: scoreAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                })}],
              }
            ]}>
              <Text style={[styles.scoreText, {
                fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
              }]}>
                🏆 {score}
              </Text>
            </Animated.View>
          </View>
        </View>

                {/* Combo and Score Popup indicators */}
        <View style={styles.feedbackSection}>
          {/* Combo indicator */}
          {combo > 1 && (
            <Animated.View style={[
              styles.comboContainer,
              {
                opacity: comboAnim,
                transform: [{ scale: comboAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                })}],
              }
            ]}>
              <Text style={styles.comboText}>🔥 COMBO x{combo}!</Text>
            </Animated.View>
          )}
          
          {/* Score Popup indicator */}
          {scorePopup.show && (
            <Animated.View style={[
              styles.scorePopupContainer,
              scorePopup.isPositive ? styles.positiveScorePopup : styles.negativeScorePopup,
              {
                opacity: scorePopupAnim,
                transform: [
                  { 
                    scale: scorePopupAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    })
                  },
                  { 
                    translateY: scorePopupAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, -30],
                    })
                  }
                ],
              }
            ]}>
              <Text style={[
                styles.scorePopupText,
                scorePopup.isPositive ? styles.positiveScoreText : styles.negativeScoreText
              ]}>
                {scorePopup.isPositive ? '+' : '-'}{scorePopup.amount}
              </Text>
            </Animated.View>
          )}
        </View>

        {!gameStarted ? (
          <View style={styles.startContainer}>
            <Text style={styles.instructionText}>
              🎯 Cocokkan gambar organ dengan fungsinya untuk mendapatkan poin!
              {'\n\n'}✨ Semakin cepat mencocokkan, semakin besar bonus waktu!
              {'\n\n'}🔥 Cocokkan berturut-turut untuk combo multiplier!
            </Text>
            <GameButton
              title="🎮 Mulai Game"
              onPress={initializeGame}
              variant="primary"
              size="large"
            />
          </View>
        ) : (
          <ScrollView style={styles.gameArea} contentContainerStyle={styles.cardsContainer}>
            <View style={[styles.cardsGrid, {
              paddingHorizontal: isTablet ? 15 : isSmallScreen ? 8 : 12,
              paddingVertical: 10,
            }]}>
              {cards.map((card) => (
                <View 
                  key={card.id} 
                  style={[styles.cardContainer, {
                    width: `${100 / getColumnsCount()}%`,
                  }]}
                >
                  <SimpleMatchCard
                    card={card}
                    onPress={handleCardPress}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Exit Warning Modal */}
        <Modal
          visible={showExitWarning}
          transparent={true}
          animationType="fade"
          onRequestClose={handleContinueGame}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, {
              width: isTablet ? '60%' : '85%',
              padding: isTablet ? 30 : 20,
            }]}>
              <Text style={[styles.modalTitle, {
                fontSize: isTablet ? 24 : 20,
              }]}>
                ⚠️ Peringatan!
              </Text>
              
              <Text style={[styles.modalMessage, {
                fontSize: isTablet ? 16 : 14,
              }]}>
                Game sedang berlangsung. Jika Anda keluar sekarang, skor tidak akan tersimpan dan progress akan hilang.
                {'\n\n'}Apakah Anda yakin ingin keluar?
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.continueButton, {
                    paddingVertical: isTablet ? 15 : 12,
                    paddingHorizontal: isTablet ? 25 : 20,
                  }]}
                  onPress={handleContinueGame}
                >
                  <Text style={[styles.continueButtonText, {
                    fontSize: isTablet ? 16 : 14,
                  }]}>
                    🎮 Lanjut Main
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.exitButton, {
                    paddingVertical: isTablet ? 15 : 12,
                    paddingHorizontal: isTablet ? 25 : 20,
                  }]}
                  onPress={handleExitWithoutSaving}
                >
                  <Text style={[styles.exitButtonText, {
                    fontSize: isTablet ? 16 : 14,
                  }]}>
                    🚪 Keluar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Saving Score Indicator */}
        {isSavingScore && (
          <View style={styles.savingOverlay}>
            <View style={styles.savingContainer}>
              <Text style={styles.savingText}>💾 Menyimpan skor...</Text>
            </View>
          </View>
        )}

        {/* User Score History Modal */}
        <UserScoreHistoryModal 
          visible={showScoreHistory}
          onClose={() => setShowScoreHistory(false)}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  muteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
  },
  muteIcon: {
    fontSize: 20,
  },
  historyButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
    marginLeft: 10,
  },
  historyIcon: {
    fontSize: 20,
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontWeight: 'bold',
  },

  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  progressText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginTop: 2,
    textAlign: 'center',
  },
  feedbackSection: {
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
    minHeight: 50,
  },
  comboContainer: {
    marginTop: 10,
    backgroundColor: Config.GAME_THEME.ACCENT_COLOR,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  comboText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scorePopupContainer: {
    position: 'absolute',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  positiveScorePopup: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  negativeScorePopup: {
    backgroundColor: '#FF5252',
  },
  scorePopupText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  positiveScoreText: {
    color: 'white',
  },
  negativeScoreText: {
    color: 'white',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  instructionText: {
    fontSize: 16,
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  gameArea: {
    flex: 1,
  },
  cardsContainer: {
    flexGrow: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  levelText: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.ACCENT_COLOR,
    textAlign: 'center',
  },
  cardContainer: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#FF5722',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalMessage: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  continueButton: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  exitButton: {
    backgroundColor: '#FF5722',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  exitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingContainer: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  savingText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 