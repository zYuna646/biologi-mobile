import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import { MATERI_CATEGORIES, MATERI_ITEMS, MateriItem } from '@/constants/MateriData';
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

interface MateriScreenProps {
  onBack: () => void;
  onMateriSelect: (materi: MateriItem) => void;
}

const { width } = Dimensions.get('window');

export const MateriScreen: React.FC<MateriScreenProps> = ({ onBack, onMateriSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  const filteredMateri = selectedCategory === 'Semua' 
    ? MATERI_ITEMS 
    : MATERI_ITEMS.filter(item => item.category === selectedCategory);

  const getColumnsCount = () => {
    if (isTablet) return 3;
    if (isSmallScreen) return 1;
    return 2;
  };

  const getCardWidth = () => {
    const columns = getColumnsCount();
    const horizontalPadding = isTablet ? 40 : isSmallScreen ? 20 : 30;
    const gap = isTablet ? 15 : 10;
    const availableWidth = width - horizontalPadding;
    return (availableWidth - (gap * (columns - 1))) / columns;
  };

  const getImageHeight = () => {
    if (isTablet) return 180;
    if (isSmallScreen) return 120;
    return 150;
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
        <Text style={[styles.headerTitle, {
          fontSize: isTablet ? 24 : isSmallScreen ? 18 : 20,
        }]}>
          📚 Materi Reproduksi
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {MATERI_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
                { fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12 }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Materi Grid */}
      <ScrollView 
        style={styles.materiArea} 
        contentContainerStyle={[styles.materiContainer, {
          paddingBottom: 20,
        }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.materiGrid, {
          paddingHorizontal: isTablet ? 20 : isSmallScreen ? 10 : 15,
          gap: isTablet ? 15 : 10,
        }]}>
          {filteredMateri.map((materi) => (
            <TouchableOpacity
              key={materi.id}
              style={[styles.materiCard, {
                width: getCardWidth(),
                marginBottom: isTablet ? 20 : 15,
              }]}
              onPress={() => onMateriSelect(materi)}
              activeOpacity={0.8}
            >
              {/* Image */}
              <View style={[styles.imageContainer, {
                height: getImageHeight(),
              }]}>
                <Image
                  source={materi.image}
                  style={styles.materiImage}
                  resizeMode="contain"
                />
                <View style={styles.overlay} />
                <View style={[styles.iconContainer, {
                  width: isTablet ? 40 : 35,
                  height: isTablet ? 40 : 35,
                }]}>
                  <Text style={[styles.categoryIcon, {
                    fontSize: isTablet ? 20 : 18,
                  }]}>{materi.icon}</Text>
                </View>
              </View>

              {/* Content */}
              <View style={[styles.cardContent, {
                padding: isTablet ? 18 : isSmallScreen ? 12 : 15,
              }]}>
                <Text style={[styles.materiTitle, {
                  fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
                }]} numberOfLines={2}>
                  {materi.title}
                </Text>
                <Text style={[styles.materiSubtitle, {
                  fontSize: isTablet ? 14 : isSmallScreen ? 11 : 12,
                }]} numberOfLines={1}>
                  {materi.subtitle}
                </Text>
                <Text style={[styles.materiDescription, {
                  fontSize: isTablet ? 13 : isSmallScreen ? 10 : 11,
                }]} numberOfLines={isSmallScreen ? 2 : 3}>
                  {materi.description}
                </Text>
                
                {/* Tags Container */}
                <View style={styles.tagsContainer}>
                  {/* Category Tag */}
                  <View style={styles.categoryTag}>
                    <Text style={[styles.categoryTagText, {
                      fontSize: isTablet ? 11 : isSmallScreen ? 9 : 10,
                    }]}>
                      {materi.category}
                    </Text>
                  </View>

                  {/* 3D Model Indicator */}
                  <View style={styles.modelIndicator}>
                    <Text style={[styles.modelIcon, {
                      fontSize: isTablet ? 14 : 12,
                    }]}>🎮</Text>
                    <Text style={[styles.modelText, {
                      fontSize: isTablet ? 11 : isSmallScreen ? 9 : 10,
                    }]}>
                      Model 3D
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredMateri.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Tidak ada materi di kategori ini</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, {
          fontSize: isTablet ? 13 : isSmallScreen ? 10 : 11,
        }]}>
          {filteredMateri.length} materi tersedia • Ketuk untuk melihat detail 3D
        </Text>
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
  headerTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  categoryContainer: {
    paddingVertical: 15,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
  },
  categoryScroll: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  selectedCategoryButton: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  categoryText: {
    color: Config.GAME_THEME.PRIMARY_COLOR,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  materiArea: {
    flex: 1,
  },
  materiContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },
  materiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  materiCard: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  materiImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    // fontSize handled dynamically
  },
  cardContent: {
    // padding handled dynamically
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  materiTitle: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 4,
  },
  materiSubtitle: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '500',
    marginBottom: 8,
  },
  materiDescription: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    lineHeight: 16,
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: Config.GAME_THEME.SECONDARY_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  categoryTagText: {
    color: 'white',
    fontWeight: '500',
  },
  modelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Config.GAME_THEME.ACCENT_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modelIcon: {
    marginRight: 4,
  },
  modelText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: Config.GAME_THEME.BACKGROUND,
  },
  footerText: {
    textAlign: 'center',
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
}); 