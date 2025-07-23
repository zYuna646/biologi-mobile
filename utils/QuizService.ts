import { Config } from '@/constants/Config';

export interface Question {
  id: number;
  question_text: string;
  question_type: 'PG' | 'PGK' | 'M' | 'IS' | 'U';
  question_number: number;
  cognitive_level: string;
  weight: number;
  score: number;
  options?: string[];
  correct_answer: string | string[];
  matching_pairs?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface QuizSession {
  id: number;
  user_id: number;
  start_time: string;
  end_time?: string;
  total_score?: number;
  total_questions: number;
  correct_answers?: number;
  duration_seconds?: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  user_id: number;
  question_id: number;
  quiz_session_id: number;
  user_answer: string | string[];
  is_correct: boolean;
  points_earned: number;
  created_at: string;
  updated_at: string;
  question?: Question;
}

export interface SubmitAnswerRequest {
  quiz_session_id: number;
  question_id: number;
  user_answer: string | string[];
}

export interface SubmitAnswersRequest {
  quiz_session_id: number;
  answers: SubmitAnswerRequest[];
}

export class QuizService {
  private static async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${Config.API_URL}${endpoint}`;
    
    console.log(`🌐 QuizService ${method} ${url}`, body ? { body } : '');
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ QuizService error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ QuizService ${method} success:`, data);
      return data;
    } catch (error) {
      console.error(`❌ QuizService ${method} ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Fetch all available questions
   */
  static async getQuestions(): Promise<Question[]> {
    return this.request<Question[]>('/questions');
  }

  /**
   * Start a new quiz session
   */
  static async startQuiz(userId: number): Promise<QuizSession> {
    return this.request<QuizSession>('/quiz/start', 'POST', {
      user_id: userId,
    });
  }

  /**
   * Submit answers for a quiz session
   */
  static async submitAnswers(request: SubmitAnswersRequest): Promise<QuizAnswer[]> {
    return this.request<QuizAnswer[]>('/quiz/answers', 'POST', request);
  }

  /**
   * Submit a single answer for a quiz session
   */
  static async submitAnswer(answer: SubmitAnswerRequest): Promise<QuizAnswer[]> {
    return this.submitAnswers({
      quiz_session_id: answer.quiz_session_id,
      answers: [answer],
    });
  }

  /**
   * Complete a quiz session
   */
  static async completeQuiz(quizSessionId: number): Promise<QuizSession> {
    return this.request<QuizSession>(`/quiz/complete/${quizSessionId}`, 'PATCH');
  }

  /**
   * Get quiz history for a user
   */
  static async getQuizHistory(userId: number): Promise<QuizSession[]> {
    return this.request<QuizSession[]>(`/quiz/history/${userId}`);
  }

  /**
   * Get a specific quiz session with answers
   */
  static async getQuizSession(quizSessionId: number): Promise<QuizSession> {
    return this.request<QuizSession>(`/quiz/session/${quizSessionId}`);
  }
} 