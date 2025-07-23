import { GameButton } from '@/components/ui/GameButton';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { Config } from '@/constants/Config';
import { QuizSession } from '@/utils/QuizService';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface QuizResultsScreenProps {
  quizSession: QuizSession;
  onBack: () => void;
  onBackToMenu: () => void;
}

const { width } = Dimensions.get('window');

export const QuizResultsScreen: React.FC<QuizResultsScreenProps> = ({
  quizSession,
  onBack,
  onBackToMenu,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [reviewQuestionIndex, setReviewQuestionIndex] = useState(0);

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getScoreGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'E';
  };

  const getPerformanceMessage = (score: number): string => {
    if (score >= 90) return 'Luar biasa! Pemahaman Anda sangat baik.';
    if (score >= 80) return 'Bagus! Anda memiliki pemahaman yang baik.';
    if (score >= 70) return 'Cukup baik. Masih ada ruang untuk perbaikan.';
    if (score >= 60) return 'Perlu belajar lebih giat lagi.';
    return 'Sebaiknya pelajari materi lebih dalam lagi.';
  };

  const correctAnswers = quizSession.correct_answers || 0;
  const totalQuestions = quizSession.total_questions;
  const totalScore = quizSession.total_score || 0;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const duration = quizSession.duration_seconds || 0;

  const handleReviewAnswers = () => {
    setShowReview(true);
    setReviewQuestionIndex(0);
  };

  const handleBackFromReview = () => {
    setShowReview(false);
  };

  const handleNextReviewQuestion = () => {
    if (quizSession.answers && reviewQuestionIndex < quizSession.answers.length - 1) {
      setReviewQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousReviewQuestion = () => {
    if (reviewQuestionIndex > 0) {
      setReviewQuestionIndex(prev => prev - 1);
    }
  };

  if (showReview && quizSession.answers) {
    const currentAnswer = quizSession.answers[reviewQuestionIndex];
    const question = currentAnswer.question;

    if (!question) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Data soal tidak tersedia</Text>
            <GameButton
              title="Kembali"
              onPress={handleBackFromReview}
              variant="secondary"
              size="medium"
            />
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        {/* Review Header */}
        <View style={styles.header}>
          <GameButton
            title="◀"
            onPress={handleBackFromReview}
            variant="secondary"
            size="small"
          />
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, {
              fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
            }]}>
              📋 Review Jawaban
            </Text>
            <Text style={[styles.progressText, {
              fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
            }]}>
              Soal {reviewQuestionIndex + 1} dari {quizSession.answers.length}
            </Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Question Review */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <QuestionCard
            question={question}
            questionIndex={reviewQuestionIndex}
            totalQuestions={quizSession.answers.length}
            userAnswer={currentAnswer.user_answer}
            onAnswerChange={() => {}} // Read-only
            isReadOnly={true}
          />

          {/* Answer Analysis */}
          <View style={styles.analysisCard}>
            <View style={styles.analysisHeader}>
              <Text style={[styles.analysisTitle, {
                fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
              }]}>
                📊 Analisis Jawaban
              </Text>
            </View>

            <View style={styles.analysisContent}>
              <View style={styles.analysisRow}>
                <Text style={[styles.analysisLabel, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]}>
                  Status:
                </Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: currentAnswer.is_correct ? '#4CAF50' : '#F44336' }
                ]}>
                  <Text style={[styles.statusText, {
                    fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                  }]}>
                    {currentAnswer.is_correct ? '✅ Benar' : '❌ Salah'}
                  </Text>
                </View>
              </View>

              <View style={styles.analysisRow}>
                <Text style={[styles.analysisLabel, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]}>
                  Poin:
                </Text>
                <Text style={[styles.analysisValue, {
                  fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
                  color: currentAnswer.is_correct ? '#4CAF50' : '#F44336',
                }]}>
                  {currentAnswer.points_earned} / {question.score}
                </Text>
              </View>

              <View style={styles.analysisRow}>
                <Text style={[styles.analysisLabel, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]}>
                  Jawaban Benar:
                </Text>
                <Text style={[styles.correctAnswer, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]}>
                  {Array.isArray(question.correct_answer) 
                    ? question.correct_answer.join(', ') 
                    : question.correct_answer}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Review Navigation */}
        <View style={styles.footer}>
          <View style={styles.navigationButtons}>
            <GameButton
              title="◀ Sebelumnya"
              onPress={handlePreviousReviewQuestion}
              variant="secondary"
              size={isTablet ? "medium" : "small"}
              disabled={reviewQuestionIndex === 0}
            />

            <Text style={[styles.reviewProgress, {
              fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
            }]}>
              {reviewQuestionIndex + 1} / {quizSession.answers.length}
            </Text>

            <GameButton
              title="Selanjutnya ▶"
              onPress={handleNextReviewQuestion}
              variant="primary"
              size={isTablet ? "medium" : "small"}
              disabled={reviewQuestionIndex === quizSession.answers.length - 1}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          🎯 Hasil Quiz
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={[styles.congratsText, {
              fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
            }]}>
              🎉 Quiz Selesai!
            </Text>
            <Text style={[styles.performanceMessage, {
              fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
            }]}>
              {getPerformanceMessage(totalScore)}
            </Text>
          </View>

          <View style={styles.mainScore}>
            <Text style={[styles.scoreNumber, {
              fontSize: isTablet ? 48 : isSmallScreen ? 36 : 42,
              color: getScoreColor(totalScore),
            }]}>
              {totalScore}
            </Text>
            <Text style={[styles.scoreLabel, {
              fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
            }]}>
              Skor Total
            </Text>
            <View style={[styles.gradeBadge, { backgroundColor: getScoreColor(totalScore) }]}>
              <Text style={[styles.gradeText, {
                fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
              }]}>
                {getScoreGrade(totalScore)}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsCard}>
          <Text style={[styles.statsTitle, {
            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
          }]}>
            📈 Statistik Lengkap
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: '#4CAF50',
              }]}>
                {correctAnswers}
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Jawaban Benar
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: '#F44336',
              }]}>
                {totalQuestions - correctAnswers}
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Jawaban Salah
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: '#FF9800',
              }]}>
                {Math.round(accuracy)}%
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Akurasi
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, {
                fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
                color: '#9C27B0',
              }]}>
                {formatDuration(duration)}
              </Text>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
              }]}>
                Waktu Total
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <GameButton
            title="📋 Review Jawaban"
            onPress={handleReviewAnswers}
            variant="secondary"
            size={isTablet ? "large" : "medium"}
            icon={<Text style={styles.buttonIcon}>👁️</Text>}
          />

          <GameButton
            title="🏠 Kembali ke Menu"
            onPress={onBackToMenu}
            variant="primary"
            size={isTablet ? "large" : "medium"}
            icon={<Text style={styles.buttonIcon}>🏠</Text>}
          />
        </View>

        {/* Quiz Info */}
        <View style={styles.infoCard}>
          <Text style={[styles.infoTitle, {
            fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
          }]}>
            ℹ️ Informasi Quiz
          </Text>
          <Text style={[styles.infoText, {
            fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
          }]}>
            Quiz ID: {quizSession.id}{'\n'}
            Total Soal: {totalQuestions}{'\n'}
            Tanggal: {new Date(quizSession.created_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 2,
  },
  progressText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scoreCard: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 20,
    padding: 30,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  congratsText: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 10,
    textAlign: 'center',
  },
  performanceMessage: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  mainScore: {
    alignItems: 'center',
    gap: 8,
  },
  scoreNumber: {
    fontWeight: 'bold',
  },
  scoreLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
  },
  gradeBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  gradeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '40%',
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
  actionSection: {
    gap: 15,
    marginBottom: 20,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  infoCard: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 8,
  },
  infoText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    lineHeight: 18,
  },
  analysisCard: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 20,
    margin: 10,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  analysisHeader: {
    marginBottom: 15,
  },
  analysisTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
  },
  analysisContent: {
    gap: 12,
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analysisLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '600',
  },
  analysisValue: {
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  correctAnswer: {
    color: Config.GAME_THEME.PRIMARY_COLOR,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewProgress: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  errorText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    fontSize: 16,
    textAlign: 'center',
  },
}); 