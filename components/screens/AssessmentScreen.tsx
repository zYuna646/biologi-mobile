import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import { QuizService, QuizSession } from '@/utils/QuizService';
import { User, UserService } from '@/utils/UserService';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AssessmentScreenProps {
  onBack: () => void;
  onStartQuiz: () => void;
  onViewHistory: () => void;
}

const { width, height } = Dimensions.get('window');

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ 
  onBack, 
  onStartQuiz,
  onViewHistory 
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  useEffect(() => {
    initializeAssessment();
    loadQuestionCount();
  }, []);

  const initializeAssessment = async () => {
    try {
      // Get current user
      const currentUser = await UserService.getCurrentUser();
      if (currentUser && currentUser.id) {
        setUser(currentUser);
        await loadQuizHistory(currentUser.id);
      }
    } catch (error) {
      console.error('Error initializing assessment:', error);
    }
  };

  const loadQuestionCount = async () => {
    try {
      setLoadingQuestions(true);
      const questions = await QuizService.getQuestions();
      
      // Filter unique questions (same logic as QuizScreen)
      const uniqueQuestions = questions.filter((question, index, array) => {
        return array.findIndex(q => 
          q.question_number === question.question_number && 
          q.question_text === question.question_text
        ) === index;
      });
      
      setQuestionCount(uniqueQuestions.length);
    } catch (error) {
      console.error('Error loading question count:', error);
      setQuestionCount(0);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadQuizHistory = async (userId: number) => {
    try {
      setLoadingHistory(true);
      const history = await QuizService.getQuizHistory(userId);
      // Get only the 3 most recent completed quizzes
      const recentCompleted = history
        .filter(quiz => quiz.is_completed)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      setRecentQuizzes(recentCompleted);
    } catch (error) {
      console.error('Error loading quiz history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!user) {
      Alert.alert(
        'Profil Diperlukan',
        'Silakan buat profil terlebih dahulu untuk memulai assessment.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      if (user?.id) {
        await QuizService.startQuiz(user.id);
        onStartQuiz();
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      Alert.alert(
        'Error',
        'Gagal memulai quiz. Silakan coba lagi.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GameButton
          title="◀"
          onPress={onBack}
          variant="secondary"
          size="small"
        />
        <Text style={[styles.headerTitle, {
          fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
        }]}>
          📝 Assessment
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, {
            fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
          }]}>
            {user ? `Halo ${user.name}!` : 'Halo!'}
          </Text>
          <Text style={[styles.descriptionText, {
            fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
          }]}>
            Uji pemahamanmu tentang sistem reproduksi manusia dengan quiz interaktif.
          </Text>
        </View>

        {/* Start Quiz Section */}
        <View style={styles.section}>
          <View style={styles.quizCard}>
            <View style={styles.quizCardContent}>
              <Text style={[styles.cardTitle, {
                fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
              }]}>
                📚 Quiz Sistem Reproduksi
              </Text>
              <Text style={[styles.cardDescription, {
                fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
              }]}>
                {loadingQuestions 
                  ? '• Memuat informasi soal...' 
                  : `• ${questionCount} soal berbagai jenis`
                }{'\n'}
                • Pilihan ganda, isian, dan matching{'\n'}
                • Durasi: Tidak terbatas{'\n'}
                • Skor berdasarkan ketepatan jawaban
              </Text>
              
              <GameButton
                title={loading ? "Memulai..." : "Mulai Quiz"}
                onPress={handleStartQuiz}
                variant="primary"
                size={isTablet ? "large" : "medium"}
                disabled={loading || loadingQuestions}
                icon={loading ? 
                  <ActivityIndicator size="small" color="#FFFFFF" /> : 
                  <Text style={styles.buttonIcon}>🚀</Text>
                }
              />
            </View>
          </View>
        </View>

        {/* Recent Quiz History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {
              fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
            }]}>
              📊 Quiz Terakhir
            </Text>
            <TouchableOpacity onPress={onViewHistory}>
              <Text style={[styles.viewAllText, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Lihat Semua →
              </Text>
            </TouchableOpacity>
          </View>

          {loadingHistory ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Config.GAME_THEME.PRIMARY_COLOR} />
              <Text style={styles.loadingText}>Memuat riwayat...</Text>
            </View>
          ) : recentQuizzes.length > 0 ? (
            <View style={styles.historyList}>
              {recentQuizzes.map((quiz, index) => (
                <View key={quiz.id} style={styles.historyItem}>
                  <View style={styles.historyContent}>
                    <View style={styles.historyHeader}>
                      <Text style={[styles.historyTitle, {
                        fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
                      }]}>
                        Quiz #{quiz.id}
                      </Text>
                      <Text style={[styles.historyDate, {
                        fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                      }]}>
                        {formatDate(quiz.created_at)}
                      </Text>
                    </View>
                    
                    <View style={styles.historyStats}>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, {
                          fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                          color: getScoreColor(quiz.total_score || 0),
                        }]}>
                          {quiz.total_score || 0}
                        </Text>
                        <Text style={[styles.statLabel, {
                          fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                        }]}>
                          Skor
                        </Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, {
                          fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                        }]}>
                          {quiz.correct_answers || 0}/{quiz.total_questions}
                        </Text>
                        <Text style={[styles.statLabel, {
                          fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                        }]}>
                          Benar
                        </Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, {
                          fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                        }]}>
                          {quiz.duration_seconds ? formatDuration(quiz.duration_seconds) : '-'}
                        </Text>
                        <Text style={[styles.statLabel, {
                          fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                        }]}>
                          Durasi
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, {
                fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
              }]}>
                Belum ada riwayat quiz.{'\n'}
                Mulai quiz pertamamu sekarang!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 25,
  },
  welcomeText: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 8,
  },
  descriptionText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  quizCard: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 20,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quizCardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 12,
  },
  cardDescription: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  viewAllText: {
    color: Config.GAME_THEME.PRIMARY_COLOR,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontSize: 14,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  historyDate: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  statLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 