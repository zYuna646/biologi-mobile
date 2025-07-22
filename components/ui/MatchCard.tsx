import { Config } from '@/constants/Config';
import { Card } from '@/constants/GameData';
import { soundManager } from '@/utils/SoundManager';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MatchCardProps {
  card: Card;
  onPress: (card: Card) => void;
}

const { width } = Dimensions.get('window');

export const MatchCard: React.FC<MatchCardProps> = ({ card, onPress }) => {
  const isSmallScreen = width < 700;
  const isTablet = width > 900;
  
  const cardSize = isTablet ? 120 : isSmallScreen ? 80 : 100;
  
  // Animation values - separated for native driver compatibility
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  // Glow animation uses separate value for non-native driver
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowRadius = useRef(new Animated.Value(4)).current;

  // Animation effects
  useEffect(() => {
    if (card.isSelected) {
      // Selection animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow effect for selected cards - using completely separate animations
      const glowOpacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      );
      
      const glowRadiusAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowRadius, {
            toValue: 12,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowRadius, {
            toValue: 4,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      );
      
      glowOpacityAnimation.start();
      glowRadiusAnimation.start();
      
      // Store references to stop later
      (card as any)._glowOpacityAnimation = glowOpacityAnimation;
      (card as any)._glowRadiusAnimation = glowRadiusAnimation;
    } else {
      scaleAnim.setValue(1);
      if ((card as any)._glowOpacityAnimation) {
        (card as any)._glowOpacityAnimation.stop();
      }
      if ((card as any)._glowRadiusAnimation) {
        (card as any)._glowRadiusAnimation.stop();
      }
      glowOpacity.setValue(0);
      glowRadius.setValue(4);
    }
  }, [card.isSelected]);

  useEffect(() => {
    if (card.isMatched) {
      // Success animation
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      // Rotation celebration
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [card.isMatched]);

  const cardStyle = [
    styles.card,
    {
      width: cardSize,
      height: cardSize,
    },
    card.isMatched && styles.matchedCard,
  ];

  const animatedCardStyle = {
    transform: [
      { 
        scale: Animated.multiply(
          scaleAnim,
          bounceAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.2, 0.9],
          })
        )
      },
      {
        rotateY: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const glowStyle = card.isSelected ? {
    shadowOpacity: glowOpacity,
    shadowRadius: glowRadius,
  } : {};

  const handlePress = async () => {
    if (!card.isMatched && !card.isSelected) {
      // Press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Play sound effect
      await soundManager.playSound('cardFlip', 0.5);
      
      onPress(card);
    }
  };

  const renderCardContent = () => {
    if (card.type === 'image') {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={card.content.image}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.imageLabel, {
            fontSize: isTablet ? 12 : isSmallScreen ? 8 : 10,
          }]}>
            {card.content.name}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.functionContainer}>
          <Text style={[styles.functionText, {
            fontSize: isTablet ? 14 : isSmallScreen ? 10 : 12,
          }]}>
            {card.content.function}
          </Text>
        </View>
      );
    }
  };

  return (
    <Animated.View style={[cardStyle, animatedCardStyle, glowStyle]}>
      <TouchableOpacity
        style={[styles.touchable, { borderRadius: 15 }]}
        onPress={handlePress}
        disabled={card.isMatched}
        activeOpacity={0.8}
      >
        {/* Shimmer effect for unmatched cards */}
        {!card.isMatched && card.isSelected && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                opacity: glowOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            ]}
          />
        )}
        
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
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderRadius: 15,
    elevation: 6,
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  touchable: {
    flex: 1,
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    borderRadius: 15,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Config.GAME_THEME.ACCENT_COLOR,
    borderRadius: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '90%',
    maxHeight: '70%',
  },
  imageLabel: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    marginTop: 4,
  },
  functionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  functionText: {
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  matchedCard: {
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  matchIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 