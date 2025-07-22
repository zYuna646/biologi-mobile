import { Config } from '@/constants/Config';
import React from 'react';
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface GameCardProps {
  title?: string;
  subtitle?: string;
  onPress: () => void;
  backgroundColor?: string;
  icon?: React.ReactNode;
  imageSource?: any;
  disabled?: boolean;
  // New props for matching game
  isSelected?: boolean;
  isMatched?: boolean;
  cardContent?: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

export const GameCard: React.FC<GameCardProps> = ({
  title,
  subtitle,
  onPress,
  backgroundColor = Config.GAME_THEME.CARD_BACKGROUND,
  icon,
  imageSource,
  disabled = false,
  isSelected = false,
  isMatched = false,
  cardContent,
}) => {
  const isSmallScreen = width < 700;
  const isTablet = width > 900;
  
  const cardStyle: ViewStyle[] = [
    styles.card,
    { backgroundColor },
    ...(disabled ? [styles.disabledCard] : []),
    ...(isSelected ? [styles.selectedCard] : []),
    ...(isMatched ? [styles.matchedCard] : []),
    {
      minHeight: isTablet ? 140 : isSmallScreen ? 100 : 120,
      padding: isTablet ? 25 : isSmallScreen ? 15 : 20,
    }
  ];

  const CardContent = () => {
    if (cardContent) {
      return <>{cardContent}</>;
    }
    
    return (
      <View style={styles.cardContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text style={[styles.title, {
            fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
          }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, {
            fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
          }]}>{subtitle}</Text>}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      disabled={disabled || isMatched}
      activeOpacity={0.8}
    >
      {imageSource ? (
        <ImageBackground source={imageSource} style={styles.imageBackground}>
          <View style={styles.overlay}>
            <CardContent />
          </View>
        </ImageBackground>
      ) : (
        <CardContent />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    margin: 10,
    justifyContent: 'center',
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 18,
  },
  imageBackground: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  disabledCard: {
    opacity: 0.5,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: Config.GAME_THEME.ACCENT_COLOR,
    shadowOpacity: 0.5,
  },
  matchedCard: {
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
    opacity: 0.7,
  },
}); 