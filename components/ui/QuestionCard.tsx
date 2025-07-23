import { Config } from '@/constants/Config';
import { Question } from '@/utils/QuizService';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  userAnswer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isReadOnly?: boolean;
}

const { width } = Dimensions.get('window');

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  isReadOnly = false,
}) => {
  const [multipleChoiceAnswer, setMultipleChoiceAnswer] = useState<string[]>(
    Array.isArray(userAnswer) ? userAnswer : []
  );
  const [textAnswer, setTextAnswer] = useState<string>(
    typeof userAnswer === 'string' ? userAnswer : ''
  );
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>(
    typeof userAnswer === 'object' && userAnswer !== null && !Array.isArray(userAnswer) 
      ? userAnswer as Record<string, string>
      : {}
  );

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  // Sync local state with userAnswer prop when it changes (e.g., when navigating between questions)
  useEffect(() => {
    if (question.question_type === 'PGK') {
      setMultipleChoiceAnswer(Array.isArray(userAnswer) ? userAnswer : []);
    } else if (question.question_type === 'IS' || question.question_type === 'U') {
      setTextAnswer(typeof userAnswer === 'string' ? userAnswer : '');
    } else if (question.question_type === 'M') {
      // For matching questions, convert from array format back to object
      if (Array.isArray(userAnswer)) {
        const matchingObj: Record<string, string> = {};
        userAnswer.forEach(pair => {
          if (typeof pair === 'string' && pair.includes('-')) {
            const [key, value] = pair.split('-');
            matchingObj[key] = value;
          }
        });
        setMatchingAnswers(matchingObj);
      } else if (typeof userAnswer === 'object' && userAnswer !== null) {
        setMatchingAnswers(userAnswer as Record<string, string>);
      } else {
        setMatchingAnswers({});
      }
    }
  }, [userAnswer, question.question_type, question.id]);

  // Reset local state when question changes
  useEffect(() => {
    if (!userAnswer) {
      setMultipleChoiceAnswer([]);
      setTextAnswer('');
      setMatchingAnswers({});
    }
  }, [question.id]);

  const handleSingleChoice = (option: string) => {
    if (isReadOnly) return;
    onAnswerChange(option);
  };

  const handleMultipleChoice = (option: string) => {
    if (isReadOnly) return;
    
    const optionLetter = option.charAt(0); // Get A, B, C, D, E
    let newAnswers: string[];
    
    if (multipleChoiceAnswer.includes(optionLetter)) {
      newAnswers = multipleChoiceAnswer.filter(a => a !== optionLetter);
    } else {
      newAnswers = [...multipleChoiceAnswer, optionLetter];
    }
    
    setMultipleChoiceAnswer(newAnswers);
    onAnswerChange(newAnswers);
  };

  const handleTextInput = (text: string) => {
    if (isReadOnly) return;
    setTextAnswer(text);
    onAnswerChange(text);
  };

  const handleMatching = (key: string, value: string) => {
    if (isReadOnly) return;
    const newMatching = { ...matchingAnswers, [key]: value };
    setMatchingAnswers(newMatching);
    
    // Convert to array format expected by API (e.g., ["1-B", "2-A"])
    const matchingArray = Object.entries(newMatching)
      .filter(([k, v]) => v) // Only include answered pairs
      .map(([k, v]) => `${k}-${v}`);
    
    onAnswerChange(matchingArray);
  };

  const renderPGQuestion = () => (
    <View style={styles.optionsContainer}>
      {question.options?.map((option, index) => {
        const isSelected = userAnswer === option.charAt(0);
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              isSelected && styles.selectedOption,
              isReadOnly && styles.readOnlyOption,
            ]}
            onPress={() => handleSingleChoice(option.charAt(0))}
            disabled={isReadOnly}
          >
            <View style={[
              styles.optionIndicator,
              isSelected && styles.selectedIndicator,
            ]}>
              <Text style={[
                styles.optionLetter,
                isSelected && styles.selectedOptionText,
                { fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14 }
              ]}>
                {option.charAt(0)}
              </Text>
            </View>
            <Text style={[
              styles.optionText,
              isSelected && styles.selectedOptionText,
              { fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14 }
            ]}>
              {option.substring(3)} {/* Remove "A. " prefix */}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPGKQuestion = () => (
    <View style={styles.optionsContainer}>
      <Text style={[styles.instructionText, {
        fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
      }]}>
        Pilih semua jawaban yang benar:
      </Text>
      {question.options?.map((option, index) => {
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
        const isSelected = multipleChoiceAnswer.includes(optionLetter);
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              isSelected && styles.selectedOption,
              isReadOnly && styles.readOnlyOption,
            ]}
            onPress={() => handleMultipleChoice(optionLetter)}
            disabled={isReadOnly}
          >
            <View style={[
              styles.checkboxIndicator,
              isSelected && styles.selectedCheckbox,
            ]}>
              <Text style={[
                styles.checkboxText,
                { fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14 }
              ]}>
                {isSelected ? '✓' : ''}
              </Text>
            </View>
            <Text style={[
              styles.optionText,
              isSelected && styles.selectedOptionText,
              { fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14 }
            ]}>
              {optionLetter}. {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderMatchingQuestion = () => {
    if (!question.matching_pairs) return null;
    
    const leftItems = Object.keys(question.matching_pairs);
    const rightItems = Object.values(question.matching_pairs);
    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    return (
      <View style={styles.matchingContainer}>
        <Text style={[styles.instructionText, {
          fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
        }]}>
          Jodohkan dengan memilih huruf yang sesuai:
        </Text>
        
        <View style={styles.matchingLayout}>
          {/* Left Column */}
          <View style={styles.matchingColumn}>
            <Text style={[styles.columnHeader, {
              fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
            }]}>
              Kolom A:
            </Text>
            {leftItems.map((item, index) => (
              <View key={`left-${index}`} style={styles.matchingItem}>
                <Text style={[styles.matchingNumber, {
                  fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
                }]}>
                  {index + 1}.
                </Text>
                <Text style={[styles.matchingText, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]}>
                  {item}
                </Text>
                
                {/* Answer selection */}
                <View style={styles.answerRow}>
                  {optionLetters.slice(0, rightItems.length).map((letter) => (
                    <TouchableOpacity
                      key={letter}
                      style={[
                        styles.matchingOption,
                        matchingAnswers[index + 1] === letter && styles.selectedMatchingOption,
                      ]}
                      onPress={() => handleMatching((index + 1).toString(), letter)}
                      disabled={isReadOnly}
                    >
                      <Text style={[
                        styles.matchingOptionText,
                        matchingAnswers[index + 1] === letter && styles.selectedMatchingText,
                        { fontSize: isTablet ? 14 : isSmallScreen ? 10 : 12 }
                      ]}>
                        {letter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
          
          {/* Right Column */}
          <View style={styles.matchingColumn}>
            <Text style={[styles.columnHeader, {
              fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
            }]}>
              Kolom B:
            </Text>
            {rightItems.map((item, index) => (
              <View key={`right-${index}`} style={styles.rightMatchingItem}>
                <Text style={[styles.matchingLetter, {
                  fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
                }]}>
                  {optionLetters[index]}.
                </Text>
                <Text style={[styles.matchingText, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTextQuestion = () => (
    <View style={styles.textInputContainer}>
      <Text style={[styles.instructionText, {
        fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
      }]}>
        {question.question_type === 'IS' ? 'Isi jawaban singkat:' : 'Tulis esai Anda:'}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          question.question_type === 'U' && styles.essayInput,
          { fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14 }
        ]}
        value={textAnswer}
        onChangeText={handleTextInput}
        placeholder={question.question_type === 'IS' ? 'Masukkan jawaban...' : 'Tulis esai Anda...'}
        placeholderTextColor={Config.GAME_THEME.TEXT_SECONDARY}
        multiline={question.question_type === 'U'}
        numberOfLines={question.question_type === 'U' ? 6 : 1}
        editable={!isReadOnly}
      />
    </View>
  );

  const renderQuestionContent = () => {
    switch (question.question_type) {
      case 'PG':
        return renderPGQuestion();
      case 'PGK':
        return renderPGKQuestion();
      case 'M':
        return renderMatchingQuestion();
      case 'IS':
      case 'U':
        return renderTextQuestion();
      default:
        return <Text>Tipe soal tidak dikenal</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {/* Question Header */}
      <View style={styles.header}>
        <Text style={[styles.questionNumber, {
          fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
        }]}>
          Soal {questionIndex + 1} dari {totalQuestions}
        </Text>
        <View style={styles.questionMeta}>
          <Text style={[styles.questionType, {
            fontSize: isTablet ? 12 : isSmallScreen ? 10 : 11,
          }]}>
            {question.question_type} • {question.cognitive_level} • Bobot: {question.weight}
          </Text>
        </View>
      </View>

      {/* Question Text */}
      <View style={styles.questionTextContainer}>
        <Text style={[styles.questionText, {
          fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
        }]}>
          {question.question_text}
        </Text>
      </View>

      {/* Question Content */}
      {renderQuestionContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    marginBottom: 15,
  },
  questionNumber: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.PRIMARY_COLOR,
    marginBottom: 5,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionType: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  questionTextContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  questionText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 12,
  },
  instructionText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  selectedOption: {
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
    backgroundColor: `${Config.GAME_THEME.PRIMARY_COLOR}15`,
  },
  readOnlyOption: {
    opacity: 0.7,
  },
  optionIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIndicator: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  optionLetter: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  selectedOptionText: {
    color: Config.GAME_THEME.PRIMARY_COLOR,
    fontWeight: '600',
  },
  optionText: {
    flex: 1,
    color: Config.GAME_THEME.TEXT_PRIMARY,
    lineHeight: 20,
  },
  checkboxIndicator: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedCheckbox: {
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  checkboxText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  matchingContainer: {
    gap: 15,
  },
  matchingLayout: {
    flexDirection: 'row',
    gap: 20,
  },
  matchingColumn: {
    flex: 1,
  },
  columnHeader: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 10,
  },
  matchingItem: {
    marginBottom: 15,
  },
  rightMatchingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingVertical: 8,
  },
  matchingNumber: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 5,
  },
  matchingLetter: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginRight: 8,
    width: 20,
  },
  matchingText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    lineHeight: 18,
    marginBottom: 8,
    flex: 1,
  },
  answerRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  matchingOption: {
    width: 30,
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMatchingOption: {
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  matchingOptionText: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  selectedMatchingText: {
    color: '#FFFFFF',
  },
  textInputContainer: {
    gap: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlignVertical: 'top',
  },
  essayInput: {
    minHeight: 120,
  },
}); 