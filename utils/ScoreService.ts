import { Config } from '@/constants/Config';

export interface GameScore {
  date: string;
  score: number;
  level: string;
  user_id: number;
}

export interface ScoreResponse {
  id: number;
  date: string;
  score: number;
  level: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export class ScoreService {
  private static readonly API_BASE = Config.API_URL;

  // Post score to API when game is completed
  static async postScore(scoreData: GameScore): Promise<ScoreResponse | null> {
    try {
      console.log('📊 Posting score to API:', scoreData);

      const response = await fetch(`${this.API_BASE}/scores`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to post score. Status: ${response.status}, Error: ${errorText}`);
        return null;
      }

      const result: ScoreResponse = await response.json();
      console.log('✅ Score posted successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error posting score:', error);
      return null;
    }
  }

  // Get current date in YYYY-MM-DD format
  static getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Create score data object for posting
  static createScoreData(score: number, level: number, userId: number): GameScore {
    return {
      date: this.getCurrentDate(),
      score: score,
      level: level.toString(),
      user_id: userId,
    };
  }
} 