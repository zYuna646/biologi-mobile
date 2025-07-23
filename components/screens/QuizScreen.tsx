import { GameButton } from '@/components/ui/GameButton';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { Config } from '@/constants/Config';
import { Question, QuizService, QuizSession, SubmitAnswerRequest } from '@/utils/QuizService';
import { UserService } from '@/utils/UserService';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface QuizScreenProps {
  onBack: () => void;
  onComplete: (session: QuizSession) => void;
}

const { width } = Dimensions.get('window');

export const QuizScreen: React.FC<QuizScreenProps> = ({ onBack, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  useEffect(() => {
    initializeQuiz();

    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => backHandler.remove();
  }, []);

  const handleBackPress = (): boolean => {
    showExitWarning();
    return true; // Prevent default behavior
  };

  const showExitWarning = () => {
    const answeredCount = getAnsweredCount();
    const hasAnswers = answeredCount > 0;

    Alert.alert(
      '⚠️ Keluar dari Quiz',
      hasAnswers 
        ? `Anda telah menjawab ${answeredCount} dari ${questions.length} soal.\n\nApakah Anda yakin ingin keluar? Jawaban yang sudah diisi akan hilang.`
        : 'Apakah Anda yakin ingin keluar dari quiz?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            // TODO: You might want to save incomplete session or clean up
            onBack();
          },
        },
      ]
    );
  };

  const initializeQuiz = async () => {
    try {
      setLoading(true);

      // Get current user
      const user = await UserService.getCurrentUser();
      if (!user || !user.id) {
        Alert.alert('Error', 'User tidak ditemukan. Silakan login kembali.');
        onBack();
        return;
      }

      // Start quiz session
      const session = await QuizService.startQuiz(user.id);
      setQuizSession(session);

      // Fetch questions
      const questionData = await QuizService.getQuestions();
      
      // Remove duplicates based on question_number and question_text
      const uniqueQuestions = questionData.filter((question, index, array) => {
        return array.findIndex(q => 
          q.question_number === question.question_number && 
          q.question_text === question.question_text
        ) === index;
      });
      
      // Sort questions by question_number
      const sortedQuestions = uniqueQuestions.sort((a, b) => a.question_number - b.question_number);
      setQuestions(sortedQuestions);

      console.log(`✅ Quiz initialized with ${sortedQuestions.length} unique questions (filtered from ${questionData.length} total)`);
    } catch (error) {
      console.error('Error initializing quiz:', error);
      Alert.alert(
        'Error',
        'Gagal memuat quiz. Silakan coba lagi.',
        [
          { text: 'Coba Lagi', onPress: initializeQuiz },
          { text: 'Kembali', onPress: onBack }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleBackButton = () => {
    showExitWarning();
  };

  const handleSubmitQuiz = async () => {
    if (!quizSession) return;

    Alert.alert(
      'Selesaikan Quiz',
      'Apakah Anda yakin ingin menyelesaikan quiz? Jawaban tidak dapat diubah setelah dikumpulkan.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Selesaikan', onPress: submitQuiz }
      ]
    );
  };

  const submitQuiz = async () => {
    if (!quizSession) return;

    try {
      setSubmitting(true);

      // Prepare answers for submission
      const answersToSubmit: SubmitAnswerRequest[] = questions.map(question => ({
        quiz_session_id: quizSession.id,
        question_id: question.id,
        user_answer: answers[question.id] || (
          question.question_type === 'PGK' ? [] : ''
        )
      }));

      // Submit all answers
      await QuizService.submitAnswers({
        quiz_session_id: quizSession.id,
        answers: answersToSubmit
      });

      // Complete the quiz
      const completedSession = await QuizService.completeQuiz(quizSession.id);
      
      console.log('✅ Quiz completed successfully:', completedSession);
      onComplete(completedSession);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert(
        'Error',
        'Gagal mengirim jawaban. Silakan coba lagi.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getAnsweredCount = (): number => {
    return questions.filter(q => {
      const answer = answers[q.id];
      if (q.question_type === 'PGK') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return Boolean(answer && answer.toString().trim().length > 0);
    }).length;
  };

  const isCurrentQuestionAnswered = (): boolean => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const answer = answers[currentQuestion.id];
    if (currentQuestion.question_type === 'PGK') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return Boolean(answer && answer.toString().trim().length > 0);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Config.GAME_THEME.PRIMARY_COLOR} />
          <Text style={[styles.loadingText, {
            fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
          }]}>
            Memuat quiz...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, {
            fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
          }]}>
            Tidak ada soal yang tersedia.
          </Text>
          <GameButton
            title="Kembali"
            onPress={onBack}
            variant="secondary"
            size="medium"
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = getAnsweredCount();
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GameButton
          title="◀"
          onPress={handleBackButton}
          variant="secondary"
          size="small"
        />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, {
            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
          }]}>
            📝 Quiz Biologi
          </Text>
          <Text style={[styles.progressText, {
            fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
          }]}>
            {answeredCount} dari {questions.length} terjawab
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={[styles.progressLabel, {
          fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
        }]}>
          {Math.round(progress)}%
        </Text>
      </View>

      {/* Question Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          userAnswer={answers[currentQuestion.id]}
          onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
        />
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <GameButton
            title="◀ Sebelumnya"
            onPress={handlePrevious}
            variant="secondary"
            size={isTablet ? "medium" : "small"}
            disabled={currentQuestionIndex === 0}
          />

          <View style={styles.answerStatus}>
            {isCurrentQuestionAnswered() ? (
              <Text style={[styles.answeredText, {
                fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
              }]}>
                ✅ Terjawab
              </Text>
            ) : (
              <Text style={[styles.unansweredText, {
                fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
              }]}>
                ⚠️ Belum dijawab
              </Text>
            )}
          </View>

          {currentQuestionIndex === questions.length - 1 ? (
            <GameButton
              title={submitting ? "Mengirim..." : "Selesaikan"}
              onPress={handleSubmitQuiz}
              variant="primary"
              size={isTablet ? "medium" : "small"}
              disabled={submitting}
              icon={submitting ? 
                <ActivityIndicator size="small" color="#FFFFFF" /> : 
                <Text style={styles.buttonIcon}>✓</Text>
              }
            />
          ) : (
            <GameButton
              title="Selanjutnya ▶"
              onPress={handleNext}
              variant="primary"
              size={isTablet ? "medium" : "small"}
            />
          )}
        </View>

        {/* Quiz Summary */}
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryText, {
            fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
          }]}>
            Soal {currentQuestionIndex + 1} dari {questions.length} • 
            {answeredCount} terjawab • 
            {questions.length - answeredCount} tersisa
          </Text>
        </View>
      </View>
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
  errorText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 20,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 4,
  },
  progressLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  content: {
    flex: 1,
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
    marginBottom: 10,
  },
  answerStatus: {
    alignItems: 'center',
  },
  answeredText: {
    color: Config.GAME_THEME.PRIMARY_COLOR,
    fontWeight: '600',
  },
  unansweredText: {
    color: Config.GAME_THEME.ACCENT_COLOR,
    fontWeight: '600',
  },
  buttonIcon: {
    fontSize: 14,
  },
  summaryContainer: {
    alignItems: 'center',
  },
  summaryText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
}); 