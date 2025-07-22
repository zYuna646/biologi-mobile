import { GameButton } from '@/components/ui/GameButton';
import { Model3DViewer } from '@/components/ui/Model3DViewer';
import { Config } from '@/constants/Config';
import { MateriItem } from '@/constants/MateriData';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MateriDetailScreenProps {
  materi: MateriItem;
  onBack: () => void;
}

const { width, height } = Dimensions.get('window');

export const MateriDetailScreen: React.FC<MateriDetailScreenProps> = ({ materi, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | '3d' | 'functions'>('overview');
  
  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {/* Main Image */}
            <View style={styles.imageSection}>
              <Image
                source={materi.image}
                style={styles.mainImage}
                resizeMode="contain"
              />
              <View style={styles.imageOverlay}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryIcon}>{materi.icon}</Text>
                  <Text style={styles.categoryBadgeText}>{materi.category}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={[styles.detailDescription, {
                fontSize: isTablet ? 16 : isSmallScreen ? 13 : 14,
                lineHeight: isTablet ? 24 : isSmallScreen ? 18 : 20,
              }]}>
                {materi.detailDescription}
              </Text>
            </View>
          </ScrollView>
        );

      case '3d':
        return (
          <View style={styles.tabContent}>
            <View style={styles.modelSection}>
              <Model3DViewer
                modelSource={materi.model3d}
                width={width - 40}
                height={isTablet ? Math.min(height * 0.6, 500) : isSmallScreen ? Math.min(height * 0.5, 300) : Math.min(height * 0.55, 400)}
                autoRotate={true}
              />
            </View>
          </View>
        );

      case 'functions':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.functionsSection}>
              <Text style={[styles.functionsTitle, {
                fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
              }]}>
                ⚙️ Fungsi Utama
              </Text>
              
              {materi.functions.map((func, index) => (
                <View key={index} style={styles.functionItem}>
                  <View style={styles.functionNumber}>
                    <Text style={styles.functionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.functionText, {
                    fontSize: isTablet ? 15 : isSmallScreen ? 12 : 13,
                  }]}>
                    {func}
                  </Text>
                </View>
              ))}
              
              {/* Additional Info */}
              <View style={styles.additionalInfo}>
                <Text style={[styles.additionalInfoTitle, {
                  fontSize: isTablet ? 16 : isSmallScreen ? 13 : 14,
                }]}>
                  💡 Tahukah Kamu?
                </Text>
                <Text style={[styles.additionalInfoText, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]}>
                  {getAdditionalInfo(materi.id)}
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  const getAdditionalInfo = (materiId: string): string => {
    const info: { [key: string]: string } = {
      testis: "Testis dapat menghasilkan sekitar 300 juta sperma setiap hari! Proses spermatogenesis memerlukan suhu yang lebih rendah dari suhu tubuh normal.",
      epididirmis: "Jika diluruskan, epididirmis manusia dapat mencapai panjang 6 meter. Sperma menghabiskan 10-14 hari di sini untuk menjadi matang.",
      skrotum: "Skrotum memiliki kemampuan unik untuk mengatur suhu dengan kontraksi dan relaksasi otot dartos sesuai dengan suhu lingkungan.",
      tubulus: "Dalam satu testis terdapat sekitar 250-400 tubulus seminiferus dengan panjang total mencapai 250 meter!",
      pampiniform: "Sistem pendingin counter-current di pampiniform plexus sangat efisien, dapat menurunkan suhu hingga 3°C dari suhu tubuh.",
      complete: "Sistem reproduksi pria bekerja secara terintegrasi, dengan kontrol hormonal dari hipotalamus, hipofisis, dan testis dalam sumbu HPG."
    };
    return info[materiId] || "Sistem reproduksi manusia adalah salah satu sistem yang paling kompleks dan menakjubkan di tubuh.";
  };

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
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, {
            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
          }]}>
            {materi.title}
          </Text>
          <Text style={[styles.headerSubtitle, {
            fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
          }]}>
            {materi.subtitle}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'overview' && styles.activeTabText,
            { fontSize: isTablet ? 13 : isSmallScreen ? 10 : 11 }
          ]}>
            📖 Penjelasan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === '3d' && styles.activeTab]}
          onPress={() => setActiveTab('3d')}
        >
          <Text style={[
            styles.tabText,
            activeTab === '3d' && styles.activeTabText,
            { fontSize: isTablet ? 13 : isSmallScreen ? 10 : 11 }
          ]}>
            🎮 Model 3D
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'functions' && styles.activeTab]}
          onPress={() => setActiveTab('functions')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'functions' && styles.activeTabText,
            { fontSize: isTablet ? 13 : isSmallScreen ? 10 : 11 }
          ]}>
            ⚙️ Fungsi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.contentArea}>
        {renderTabContent()}
      </View>
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
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  headerSubtitle: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginTop: 2,
  },
  placeholder: {
    width: 60,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  tabText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageSection: {
    position: 'relative',
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mainImage: {
    width: '100%',
    height: 250,
    minHeight: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  descriptionSection: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 20,
  },
  detailDescription: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'justify',
  },
  modelSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modelInfo: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 20,
  },
  modelInfoTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 10,
  },
  modelInfoText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    lineHeight: 18,
    marginBottom: 15,
  },
  modelFeatures: {
    justifyContent: 'space-around',
    marginTop: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureItemSmall: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  featureIcon: {
    marginBottom: 4,
    marginRight: 8,
  },
  featureText: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  functionsSection: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 20,
  },
  functionsTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  functionItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  functionNumber: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    minWidth: 30,
  },
  functionNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  functionText: {
    flex: 1,
    color: Config.GAME_THEME.TEXT_PRIMARY,
    lineHeight: 20,
  },
  additionalInfo: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Config.GAME_THEME.SECONDARY_COLOR,
    borderRadius: 12,
  },
  additionalInfoTitle: {
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  additionalInfoText: {
    color: 'white',
    lineHeight: 18,
  },
}); 