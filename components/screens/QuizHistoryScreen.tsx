import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import { QuizService, QuizSession } from '@/utils/QuizService';
import { UserService } from '@/utils/UserService';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface QuizHistoryScreenProps {
  onBack: () => void;
  onViewQuizResult: (quizSession: QuizSession) => void;
}

const { width } = Dimensions.get('window');

export const QuizHistoryScreen: React.FC<QuizHistoryScreenProps> = ({
  onBack,
  onViewQuizResult,
}) => {
  const [loading, setLoading] = useState(true);
  const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      setLoading(true);
      const user = await UserService.getCurrentUser();
      if (user && user.id) {
        const history = await QuizService.getQuizHistory(user.id);
        // Sort by creation date (newest first)
        const sortedHistory = history.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setQuizHistory(sortedHistory);
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getFilteredHistory = (): QuizSession[] => {
    switch (filterStatus) {
      case 'completed':
        return quizHistory.filter(quiz => quiz.is_completed);
      case 'incomplete':
        return quizHistory.filter(quiz => !quiz.is_completed);
      default:
        return quizHistory;
    }
  };

  const getOverallStats = () => {
    const completedQuizzes = quizHistory.filter(quiz => quiz.is_completed);
    const totalQuizzes = quizHistory.length;
    const averageScore = completedQuizzes.length > 0 
      ? completedQuizzes.reduce((sum, quiz) => sum + (quiz.total_score || 0), 0) / completedQuizzes.length
      : 0;
    const bestScore = completedQuizzes.length > 0 
      ? Math.max(...completedQuizzes.map(quiz => quiz.total_score || 0))
      : 0;

    return {
      totalQuizzes,
      completedQuizzes: completedQuizzes.length,
      averageScore: Math.round(averageScore),
      bestScore,
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Config.GAME_THEME.PRIMARY_COLOR} />
          <Text style={[styles.loadingText, {
            fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
          }]}>
            Memuat riwayat quiz...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredHistory = getFilteredHistory();
  const stats = getOverallStats();

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
          📊 Riwayat Quiz
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Statistics */}
        <View style={styles.statsCard}>
          <Text style={[styles.statsTitle, {
            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
          }]}>
            📈 Statistik Keseluruhan
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: Config.GAME_THEME.PRIMARY_COLOR,
              }]}>
                {stats.totalQuizzes}
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Total Quiz
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: '#4CAF50',
              }]}>
                {stats.completedQuizzes}
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Selesai
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: getScoreColor(stats.averageScore),
              }]}>
                {stats.averageScore}
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Rata-rata
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: getScoreColor(stats.bestScore),
              }]}>
                {stats.bestScore}
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Terbaik
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <Text style={[styles.filterTitle, {
            fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
          }]}>
            Filter:
          </Text>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'Semua' },
              { key: 'completed', label: 'Selesai' },
              { key: 'incomplete', label: 'Belum Selesai' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  filterStatus === filter.key && styles.activeFilterButton,
                ]}
                onPress={() => setFilterStatus(filter.key as any)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterStatus === filter.key && styles.activeFilterButtonText,
                  { fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12 }
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quiz History List */}
        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, {
            fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
          }]}>
            📝 Daftar Quiz ({filteredHistory.length})
          </Text>

          {filteredHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, {
                fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
              }]}>
                {filterStatus === 'all' 
                  ? 'Belum ada riwayat quiz.\nMulai quiz pertamamu sekarang!' 
                  : `Tidak ada quiz dengan status "${filterStatus === 'completed' ? 'selesai' : 'belum selesai'}".`
                }
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {filteredHistory.map((quiz) => (
                <TouchableOpacity
                  key={quiz.id}
                  style={styles.historyItem}
                  onPress={() => quiz.is_completed && onViewQuizResult(quiz)}
                  disabled={!quiz.is_completed}
                >
                  <View style={styles.historyHeader}>
                    <View style={styles.historyTitleRow}>
                      <Text style={[styles.historyTitle, {
                        fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                      }]}>
                        Quiz #{quiz.id}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: quiz.is_completed ? '#4CAF50' : '#FF9800' }
                      ]}>
                        <Text style={[styles.statusText, {
                          fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                        }]}>
                          {quiz.is_completed ? '✅ Selesai' : '⏳ Proses'}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={[styles.historyDate, {
                      fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                    }]}>
                      {formatDate(quiz.created_at)}
                    </Text>
                  </View>

                  <View style={styles.historyStats}>
                    {quiz.is_completed ? (
                      <>
                        <View style={styles.statItemSmall}>
                          <Text style={[styles.statValueSmall, {
                            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
                            color: getScoreColor(quiz.total_score || 0),
                          }]}>
                            {quiz.total_score || 0}
                          </Text>
                          <Text style={[styles.statLabelSmall, {
                            fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                          }]}>
                            Skor
                          </Text>
                        </View>

                        <View style={styles.statItemSmall}>
                          <Text style={[styles.statValueSmall, {
                            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
                          }]}>
                            {quiz.correct_answers || 0}/{quiz.total_questions}
                          </Text>
                          <Text style={[styles.statLabelSmall, {
                            fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                          }]}>
                            Benar
                          </Text>
                        </View>

                        <View style={styles.statItemSmall}>
                          <Text style={[styles.statValueSmall, {
                            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
                          }]}>
                            {quiz.duration_seconds ? formatDuration(quiz.duration_seconds) : '-'}
                          </Text>
                          <Text style={[styles.statLabelSmall, {
                            fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                          }]}>
                            Durasi
                          </Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.incompleteInfo}>
                        <Text style={[styles.incompleteText, {
                          fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                        }]}>
                          Quiz belum diselesaikan
                        </Text>
                        <Text style={[styles.incompleteSubtext, {
                          fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                        }]}>
                          Mulai: {formatDate(quiz.start_time)}
                        </Text>
                      </View>
                    )}
                  </View>

                  {quiz.is_completed && (
                    <View style={styles.viewButton}>
                      <Text style={[styles.viewButtonText, {
                        fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
                      }]}>
                        Tap untuk melihat detail →
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    fontWeight: '600',
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
  statsCard: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterTitle: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterButton: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  filterButtonText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  historySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 15,
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
  historyHeader: {
    marginBottom: 12,
  },
  historyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  historyTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  historyDate: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItemSmall: {
    alignItems: 'center',
  },
  statValueSmall: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  statLabelSmall: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginTop: 2,
  },
  incompleteInfo: {
    alignItems: 'center',
    flex: 1,
  },
  incompleteText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  incompleteSubtext: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontSize: 11,
    marginTop: 2,
  },
  viewButton: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  viewButtonText: {
    color: Config.GAME_THEME.PRIMARY_COLOR,
    fontWeight: '600',
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