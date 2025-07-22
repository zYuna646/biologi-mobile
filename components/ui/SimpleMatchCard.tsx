import { Config } from '@/constants/Config';
import { Card } from '@/constants/GameData';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SimpleMatchCardProps {
  card: Card;
  onPress: (card: Card) => void;
}

const { width } = Dimensions.get('window');

export const SimpleMatchCard: React.FC<SimpleMatchCardProps> = ({ card, onPress }) => {
  const isSmallScreen = width < 700;
  const isTablet = width > 900;
  
  // More responsive card sizing with better proportions
  const cardWidth = isTablet ? 140 : isSmallScreen ? 90 : 120;
  const cardHeight = isTablet ? 160 : isSmallScreen ? 120 : 140;
  
  const cardStyle = [
    styles.card,
    {
      width: cardWidth,
      height: cardHeight,
    },
    card.isSelected && styles.selectedCard,
    card.isMatched && styles.matchedCard,
  ];

  const handlePress = () => {
    if (!card.isMatched && !card.isSelected) {
      onPress(card);
    }
  };

  const renderCardContent = () => {
    if (card.type === 'image') {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={card.content.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.imageLabel, {
            fontSize: isTablet ? 11 : isSmallScreen ? 8 : 9,
          }]} numberOfLines={2} ellipsizeMode="tail">
            {card.content.name}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.functionContainer}>
          <View style={styles.functionIconContainer}>
            <Text style={styles.functionIcon}>⚙️</Text>
          </View>
          <Text style={[styles.functionText, {
            fontSize: isTablet ? 12 : isSmallScreen ? 9 : 10,
          }]} numberOfLines={4} ellipsizeMode="tail">
            {card.content.function}
          </Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={handlePress}
      disabled={card.isMatched}
      activeOpacity={0.8}
    >
      {/* Card content */}
      <View style={styles.contentContainer}>
        {renderCardContent()}
      </View>

      {/* Match indicator */}
      {card.isMatched && (
        <View style={styles.matchIndicator}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}

      {/* Selection border */}
      {card.isSelected && <View style={styles.selectionBorder} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    margin: 0,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: Config.GAME_THEME.ACCENT_COLOR,
    backgroundColor: '#FFF8E1',
    shadowOpacity: 0.4,
    elevation: 10,
    transform: [{ scale: 1.02 }],
  },
  matchedCard: {
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 6,
  },
  image: {
    width: '85%',
    height: '85%',
    maxWidth: 80,
    maxHeight: 80,
  },
  imageLabel: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 12,
  },
  functionContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  functionIconContainer: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  functionIcon: {
    fontSize: 20,
  },
  functionText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 13,
    fontWeight: '500',
    flex: 1,
  },
  matchIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectionBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Config.GAME_THEME.ACCENT_COLOR,
    backgroundColor: 'transparent',
  },
}); 