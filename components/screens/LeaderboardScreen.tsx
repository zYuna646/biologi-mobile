import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import { LeaderboardEntry, LeaderboardService } from '@/utils/LeaderboardService';
import { UserService } from '@/utils/UserService';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const { width, height } = Dimensions.get('window');

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  // Load leaderboard data
  const loadLeaderboard = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      // Get current user for highlighting
      const currentUser = await UserService.getCurrentUser();
      if (currentUser?.id) {
        setCurrentUserId(currentUser.id);
      }

      // Fetch leaderboard data
      const data = await LeaderboardService.getLeaderboard(20); // Get top 20
      setLeaderboard(data);

    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setError('Gagal memuat leaderboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadLeaderboard(true);
  }, [loadLeaderboard]);

  // Render leaderboard entry
  const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => {
    const isCurrentUser = currentUserId === entry.user_id;
    const rankEmoji = LeaderboardService.getRankEmoji(entry.rank);
    const rankColor = LeaderboardService.getRankColor(entry.rank);

    return (
      <View 
        key={`${entry.user_id}-${index}`}
        style={[
          styles.leaderboardEntry,
          isCurrentUser && styles.currentUserEntry,
          {
            marginHorizontal: isTablet ? 20 : 15,
            marginBottom: isTablet ? 12 : 10,
            padding: isTablet ? 20 : 16,
          }
        ]}
      >
        {/* Rank */}
        <View style={[styles.rankContainer, {
          width: isTablet ? 60 : 50,
          height: isTablet ? 60 : 50,
          borderRadius: isTablet ? 30 : 25,
        }]}>
          <Text style={[styles.rankEmoji, {
            fontSize: isTablet ? 24 : 20,
          }]}>
            {rankEmoji}
          </Text>
          <Text style={[styles.rankNumber, {
            fontSize: isTablet ? 14 : 12,
            color: rankColor,
          }]}>
            #{entry.rank}
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={[styles.userName, {
            fontSize: isTablet ? 18 : 16,
          }]}>
            {entry.name}
            {isCurrentUser && <Text style={styles.youIndicator}> (Anda)</Text>}
          </Text>
          <Text style={[styles.userClass, {
            fontSize: isTablet ? 14 : 12,
          }]}>
            🎒 Kelas {entry.class}
          </Text>
          <Text style={[styles.totalGames, {
            fontSize: isTablet ? 13 : 11,
          }]}>
            🎮 {entry.total_games} game{entry.total_games > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreNumber, {
            fontSize: isTablet ? 24 : 20,
          }]}>
            {entry.highest_score.toLocaleString()}
          </Text>
          <Text style={[styles.scoreLabel, {
            fontSize: isTablet ? 12 : 10,
          }]}>
            Skor Tertinggi
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, {
          paddingHorizontal: isTablet ? 25 : 20,
          paddingVertical: isTablet ? 20 : 15,
        }]}>
          <GameButton
            title="◀"
            onPress={onBack}
            variant="secondary"
            size="small"
          />
          <Text style={[styles.headerTitle, {
            fontSize: isTablet ? 24 : 20,
          }]}>
            🏆 Papan Peringkat
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Loading */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Config.GAME_THEME.PRIMARY_COLOR} />
          <Text style={[styles.loadingText, {
            fontSize: isTablet ? 16 : 14,
          }]}>
            Memuat papan peringkat...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, {
          paddingHorizontal: isTablet ? 25 : 20,
          paddingVertical: isTablet ? 20 : 15,
        }]}>
          <GameButton
            title="◀"
            onPress={onBack}
            variant="secondary"
            size="small"
          />
          <Text style={[styles.headerTitle, {
            fontSize: isTablet ? 24 : 20,
          }]}>
            🏆 Papan Peringkat
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Error */}
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😞</Text>
          <Text style={[styles.errorText, {
            fontSize: isTablet ? 16 : 14,
          }]}>
            {error}
          </Text>
          <GameButton
            title="🔄 Coba Lagi"
            onPress={() => loadLeaderboard()}
            variant="primary"
            size={isTablet ? "large" : "medium"}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, {
        paddingHorizontal: isTablet ? 25 : 20,
        paddingVertical: isTablet ? 20 : 15,
      }]}>
        <GameButton
          title="◀"
          onPress={onBack}
          variant="secondary"
          size="small"
        />
        <Text style={[styles.headerTitle, {
          fontSize: isTablet ? 24 : 20,
        }]}>
          🏆 Papan Peringkat
        </Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={[styles.refreshIcon, {
            fontSize: isTablet ? 20 : 18,
          }]}>
            🔄
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Header */}
      <View style={[styles.statsHeader, {
        marginHorizontal: isTablet ? 20 : 15,
        marginBottom: isTablet ? 20 : 15,
        padding: isTablet ? 20 : 16,
      }]}>
        <Text style={[styles.statsTitle, {
          fontSize: isTablet ? 18 : 16,
        }]}>
          📊 Top {leaderboard.length} Pemain Terbaik
        </Text>
        <Text style={[styles.statsSubtitle, {
          fontSize: isTablet ? 14 : 12,
        }]}>
          Berdasarkan skor tertinggi yang pernah dicapai
        </Text>
      </View>

      {/* Leaderboard List */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: isTablet ? 30 : 20,
        }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Config.GAME_THEME.PRIMARY_COLOR]}
            tintColor={Config.GAME_THEME.PRIMARY_COLOR}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎮</Text>
            <Text style={[styles.emptyText, {
              fontSize: isTablet ? 16 : 14,
            }]}>
              Belum ada pemain yang tercatat.
              {'\n'}Mainkan game untuk menjadi yang pertama!
            </Text>
          </View>
        ) : (
          leaderboard.map((entry, index) => renderLeaderboardEntry(entry, index))
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
  },
  refreshIcon: {
    // fontSize handled dynamically
  },
  statsHeader: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 5,
  },
  statsSubtitle: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentUserEntry: {
    borderWidth: 2,
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
    backgroundColor: '#F8F9FA',
  },
  rankContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Config.GAME_THEME.BACKGROUND,
    marginRight: 15,
  },
  rankEmoji: {
    // fontSize handled dynamically
  },
  rankNumber: {
    fontWeight: 'bold',
    marginTop: -2,
    // fontSize and color handled dynamically
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 3,
    // fontSize handled dynamically
  },
  youIndicator: {
    color: Config.GAME_THEME.PRIMARY_COLOR,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },
  userClass: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginBottom: 2,
    // fontSize handled dynamically
  },
  totalGames: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontStyle: 'italic',
    // fontSize handled dynamically
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.ACCENT_COLOR,
    // fontSize handled dynamically
  },
  scoreLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    // fontSize handled dynamically
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginTop: 15,
    textAlign: 'center',
    // fontSize handled dynamically
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    // fontSize handled dynamically
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    // fontSize handled dynamically
  },
}); 