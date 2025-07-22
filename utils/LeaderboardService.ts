import { Config } from '@/constants/Config';

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  name: string;
  class: string;
  highest_score: number;
  total_games: number;
}

export class LeaderboardService {
  private static readonly API_BASE = Config.API_URL;

  // Fetch leaderboard data from API
  static async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      console.log('🏆 Fetching leaderboard from API...');

      const response = await fetch(`${this.API_BASE}/scores/leaderboard?limit=${limit}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to fetch leaderboard. Status: ${response.status}, Error: ${errorText}`);
        return [];
      }

      const leaderboard: LeaderboardEntry[] = await response.json();
      console.log('✅ Leaderboard fetched successfully:', leaderboard);
      return leaderboard;

    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get user's rank from leaderboard
  static getUserRank(leaderboard: LeaderboardEntry[], userId: number): number | null {
    const userEntry = leaderboard.find(entry => entry.user_id === userId);
    return userEntry ? userEntry.rank : null;
  }

  // Get rank suffix (1st, 2nd, 3rd, etc.)
  static getRankSuffix(rank: number): string {
    if (rank >= 11 && rank <= 13) {
      return `${rank}th`;
    }
    
    switch (rank % 10) {
      case 1:
        return `${rank}st`;
      case 2:
        return `${rank}nd`;
      case 3:
        return `${rank}rd`;
      default:
        return `${rank}th`;
    }
  }

  // Get rank emoji based on position
  static getRankEmoji(rank: number): string {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  }

  // Get rank color based on position
  static getRankColor(rank: number): string {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#6B7280'; // Gray
    }
  }
} 