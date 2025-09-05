import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import { UserScore, UserScoreService } from '@/utils/UserScoreService';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface UserScoreHistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const UserScoreHistoryModal: React.FC<UserScoreHistoryModalProps> = ({ 
  visible, 
  onClose 
}) => {
  const [userScores, setUserScores] = useState<UserScore[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    bestScore: 0,
    totalGames: 0,
    averageScore: 0,
  });
  const [exportLoading, setExportLoading] = useState(false);
  
  // Function to export scores to Excel (CSV format)  
  const handleExportToExcel = async () => {
    if (!userScores || userScores.length === 0) {
      Alert.alert('Peringatan', 'Tidak ada data skor untuk diunduh');
      return;
    }

    try {
      setExportLoading(true);
      
      // Create CSV content
      let csvContent = 'No,Tanggal,Level,Skor\n';
      
      userScores.forEach((score, index) => {
        const formattedDate = UserScoreService.formatDate(score.created_at);
        csvContent += `${index + 1},"${formattedDate}",${score.level},${score.score}\n`;
      });
      
      // Generate filename with current date
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0];
      const fileName = `skor_biologi_${formattedDate}.csv`;
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For mobile, save file and share
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
          encoding: FileSystem.EncodingType.UTF8
        });
        
        // Langsung gunakan fileUri untuk semua platform
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Unduh Data Skor',
          UTI: 'public.comma-separated-values-text'
        });
      }
      
      Alert.alert('Sukses', 'Data skor berhasil diunduh');
    } catch (error) {
      console.error('Error exporting scores:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengunduh data skor');
    } finally {
      setExportLoading(false);
    }
  };

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  // Load user scores
  const loadUserScores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userScoreDetails = await UserScoreService.getUserScoresHistory();
      
      if (userScoreDetails && userScoreDetails.scores) {
        const sortedScores = UserScoreService.sortScoresByDate(userScoreDetails.scores);
        setUserScores(sortedScores);

        // Calculate stats
        const bestScore = UserScoreService.getBestScore(sortedScores);
        const totalGames = UserScoreService.getTotalGamesPlayed(sortedScores);
        const averageScore = UserScoreService.getAverageScore(sortedScores);

        setStats({
          bestScore: bestScore?.score || 0,
          totalGames,
          averageScore,
        });
      } else {
        setError('Belum ada riwayat skor');
      }
    } catch (error) {
      console.error('Error loading user scores:', error);
      setError('Gagal memuat riwayat skor');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load scores when modal becomes visible
  useEffect(() => {
    if (visible) {
      loadUserScores();
    }
  }, [visible, loadUserScores]);

  // Render individual score entry
  const renderScoreEntry = (score: UserScore, index: number) => (
    <View 
      key={score.id} 
      style={[
        styles.scoreEntry, 
        index % 2 === 0 ? styles.evenRow : styles.oddRow,
        {
          paddingHorizontal: isTablet ? 20 : 15,
          paddingVertical: isTablet ? 15 : 12,
        }
      ]}
    >
      <View style={styles.scoreEntryLeft}>
        <Text style={[styles.scoreDate, {
          fontSize: isTablet ? 14 : 12,
        }]}>
          {UserScoreService.formatDate(score.created_at)}
        </Text>
        <Text style={[styles.scoreLevel, {
          fontSize: isTablet ? 13 : 11,
        }]}>
          Level {score.level}
        </Text>
      </View>
      
      <View style={styles.scoreEntryRight}>
        <Text style={[styles.scoreNumber, {
          fontSize: isTablet ? 20 : 18,
        }]}>
          {score.score}
        </Text>
      </View>
    </View>
  );

  // Render loading state
  if (loading) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {
            width: isTablet ? '60%' : '85%',
            padding: isTablet ? 30 : 20,
          }]}>
            <Text style={[styles.modalTitle, {
              fontSize: isTablet ? 24 : 20,
            }]}>
              📊 Riwayat Skor
            </Text>
            
            <View style={styles.loadingContainer}>
              <ActivityIndicator 
                size="large" 
                color={Config.GAME_THEME.PRIMARY_COLOR} 
              />
              <Text style={[styles.loadingText, {
                fontSize: isTablet ? 16 : 14,
                marginTop: 15,
              }]}>
                Memuat riwayat skor...
              </Text>
            </View>
            
            <GameButton
              title="Tutup"
              onPress={onClose}
              variant="secondary"
              size={isTablet ? "medium" : "small"}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // Render error state
  if (error) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {
            width: isTablet ? '60%' : '85%',
            padding: isTablet ? 30 : 20,
          }]}>
            <Text style={[styles.modalTitle, {
              fontSize: isTablet ? 24 : 20,
            }]}>
              📊 Riwayat Skor
            </Text>
            
            <View style={styles.errorContainer}>
              <Text style={styles.errorEmoji}>😞</Text>
              <Text style={[styles.errorText, {
                fontSize: isTablet ? 16 : 14,
              }]}>
                {error}
              </Text>
            </View>
            
            <GameButton
              title="Tutup"
              onPress={onClose}
              variant="secondary"
              size={isTablet ? "medium" : "small"}
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, {
          width: isTablet ? '80%' : '95%',
          height: isTablet ? '80%' : '90%',
        }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Text style={[styles.modalTitle, {
                fontSize: isTablet ? 24 : 20,
              }]}>
                📊 Riwayat Skor
              </Text>
              {userScores && userScores.length > 0 && (
                <TouchableOpacity 
                  onPress={handleExportToExcel} 
                  disabled={exportLoading}
                  style={[styles.downloadButton, exportLoading && styles.downloadButtonDisabled]}
                >
                  <Text style={styles.downloadButtonText}>
                    {exportLoading ? "Mengunduh..." : "📥 Excel"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, {
                fontSize: isTablet ? 20 : 18,
              }]}>✕</Text>
            </TouchableOpacity>
          </View>


          
          {/* Stats Summary */}
          <View style={[styles.statsSummary, {
            marginHorizontal: isTablet ? 20 : 15,
            marginVertical: isTablet ? 10 : 5,
            padding: isTablet ? 20 : 16,
          }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 16 : 14,
              }]}>🏆 Skor Tertinggi</Text>
              <Text style={[styles.statValue, {
                fontSize: isTablet ? 24 : 20,
              }]}>
                {stats.bestScore}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 16 : 14,
              }]}>🎮 Total Game</Text>
              <Text style={[styles.statValue, {
                fontSize: isTablet ? 24 : 20,
              }]}>
                {stats.totalGames}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, {
                fontSize: isTablet ? 16 : 14,
              }]}>📊 Rata-rata Skor</Text>
              <Text style={[styles.statValue, {
                fontSize: isTablet ? 24 : 20,
              }]}>
                {stats.averageScore}
              </Text>
            </View>
          </View>

          {/* Scores List */}
          <ScrollView 
            style={styles.scoresListContainer}
            contentContainerStyle={[styles.scoresList, {
              paddingHorizontal: isTablet ? 20 : 15,
              paddingBottom: isTablet ? 30 : 20,
            }]}
            showsVerticalScrollIndicator={false}
          >
            {userScores && userScores.length > 0 ? (
              userScores.map(renderScoreEntry)
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🎮</Text>
                <Text style={[styles.emptyText, {
                  fontSize: isTablet ? 16 : 14,
                }]}>
                  Belum ada riwayat skor.
                  {'\n'}Mainkan game untuk mulai mencatat skor!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};



const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Config.GAME_THEME.BACKGROUND,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 10,
  },
  downloadButtonDisabled: {
    opacity: 0.5,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
  },

  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Config.GAME_THEME.BACKGROUND,
    borderRadius: 15,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginBottom: 5,
  },
  statValue: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  scoresListContainer: {
    flex: 1,
  },
  scoresList: {
    flexGrow: 1,
  },
  scoreEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Config.GAME_THEME.BACKGROUND,
  },
  evenRow: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  oddRow: {
    backgroundColor: 'transparent',
  },
  scoreEntryLeft: {
    flex: 1,
  },
  scoreDate: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginBottom: 3,
  },
  scoreLevel: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  scoreEntryRight: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.ACCENT_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});