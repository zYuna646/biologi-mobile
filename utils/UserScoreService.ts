import { Config } from '@/constants/Config';
import { UserService } from './UserService';

export interface UserScore {
  id: number;
  date: string;
  score: number;
  level: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface UserScoreDetails {
  id: number;
  device_token: string;
  name: string;
  class: string;
  scores: UserScore[];
  created_at: string;
  updated_at: string;
}

export class UserScoreService {
  private static readonly API_BASE = Config.API_URL;

  // Fetch user scores history by device token
  static async getUserScoresHistory(): Promise<UserScoreDetails | null> {
    try {
      // Get current user's device token
      const currentUser = await UserService.getCurrentUser();
      if (!currentUser) {
        console.warn('⚠️ No user found');
        return null;
      }

      console.log('📊 Fetching user scores history...');

      const response = await fetch(`${this.API_BASE}/users/device/${currentUser.device_token}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to fetch user scores. Status: ${response.status}, Error: ${errorText}`);
        return null;
      }

      const userScoreDetails: UserScoreDetails = await response.json();
      console.log('✅ User scores fetched successfully:', userScoreDetails);
      return userScoreDetails;

    } catch (error) {
      console.error('❌ Error fetching user scores:', error);
      return null;
    }
  }

  // Format date to more readable format
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Sort scores by date (most recent first)
  static sortScoresByDate(scores: UserScore[]): UserScore[] {
    return scores.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // Get best score
  static getBestScore(scores: UserScore[]): UserScore | null {
    if (scores.length === 0) return null;
    return scores.reduce((best, current) => 
      (current.score > best.score) ? current : best
    );
  }

  // Get total games played
  static getTotalGamesPlayed(scores: UserScore[]): number {
    return scores.length;
  }

  // Get average score
  static getAverageScore(scores: UserScore[]): number {
    if (scores.length === 0) return 0;
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    return Math.round(totalScore / scores.length);
  }
} 