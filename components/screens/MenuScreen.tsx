import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MenuScreenProps {
  onTopicSelect: (topic: string) => void;
  onBack: () => void;
}

const { width, height } = Dimensions.get('window');

const menuItems = [
  {
    id: 'play',
    title: 'Main',
    icon: '▶️',
  },
  {
    id: 'materi',
    title: 'Materi',
    icon: '📚',
  },
  {
    id: 'assessment',
    title: 'Assessment',
    icon: '📝',
  },
  {
    id: 'leaderboard',
    title: 'Papan Skor',
    icon: '🏆',
  },
];

export const MenuScreen: React.FC<MenuScreenProps> = ({ onTopicSelect, onBack }) => {
  const isSmallScreen = width < 700;
  const isTablet = width > 900;
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Menu Content */}
      <View style={styles.content}>
        {/* Back Button at Top */}
        <View style={styles.topButtonContainer}>
          <GameButton
            title="◀"
            onPress={onBack}
            variant="secondary"
            size="small"
          />
        </View>

        {/* App Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.appTitle}>{Config.APP_NAME}</Text>
          <Text style={styles.appSubtitle}>Pilih menu untuk memulai</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.menuContainer, {
            paddingHorizontal: isTablet ? 60 : isSmallScreen ? 20 : 40
          }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => onTopicSelect(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, {
                  width: isTablet ? 100 : isSmallScreen ? 60 : 80,
                  height: isTablet ? 100 : isSmallScreen ? 60 : 80,
                }]}>
                  <Text style={[styles.menuIcon, {
                    fontSize: isTablet ? 40 : isSmallScreen ? 24 : 32
                  }]}>{item.icon}</Text>
                </View>
                <Text style={[styles.menuText, {
                  fontSize: isTablet ? 18 : isSmallScreen ? 12 : 14,
                  marginTop: isTablet ? 12 : isSmallScreen ? 6 : 8,
                }]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>


        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingVertical: 15,
  },
  topButtonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  appTitle: {
    fontSize: width > 900 ? 32 : width < 700 ? 24 : 28,
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    fontFamily: Config.FONTS.TITLE,
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: width > 900 ? 18 : width < 700 ? 14 : 16,
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
    flexWrap: 'wrap',
    gap: 10,
  },
  menuItem: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuIcon: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
  },
  menuText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    fontWeight: '600',
    textAlign: 'center',
  },


}); 