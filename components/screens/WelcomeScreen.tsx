import { GameButton } from '@/components/ui/GameButton';
import { Config } from '@/constants/Config';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface WelcomeScreenProps {
  onStart: () => void;
}

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const isSmallScreen = width < 700;
  const isTablet = width > 900;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        {/* Animated circles for decoration */}
        <View style={[styles.circle, styles.circle1, {
          width: isTablet ? 300 : isSmallScreen ? 150 : 200,
          height: isTablet ? 300 : isSmallScreen ? 150 : 200,
        }]} />
        <View style={[styles.circle, styles.circle2, {
          width: isTablet ? 200 : isSmallScreen ? 100 : 150,
          height: isTablet ? 200 : isSmallScreen ? 100 : 150,
        }]} />
        <View style={[styles.circle, styles.circle3, {
          width: isTablet ? 150 : isSmallScreen ? 75 : 100,
          height: isTablet ? 150 : isSmallScreen ? 75 : 100,
        }]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
            paddingHorizontal: isTablet ? 80 : isSmallScreen ? 20 : 30,
            paddingVertical: isTablet ? 40 : isSmallScreen ? 15 : 25,
          },
        ]}
      >
        {/* App Icon/Logo Area */}
        <View style={styles.logoContainer}>
          <View style={[styles.logo, {
            width: isTablet ? 150 : isSmallScreen ? 100 : 120,
            height: isTablet ? 150 : isSmallScreen ? 100 : 120,
            borderRadius: isTablet ? 75 : isSmallScreen ? 50 : 60,
          }]}>
            <Text style={[styles.logoEmoji, {
              fontSize: isTablet ? 80 : isSmallScreen ? 50 : 60,
            }]}>🌱</Text>
          </View>
        </View>

        {/* App Title */}
        <Text style={[styles.title, {
          fontSize: isTablet ? 40 : isSmallScreen ? 28 : 32,
          marginBottom: isSmallScreen ? 8 : 12,
        }]}>{Config.APP_NAME}</Text>
        <Text style={[styles.subtitle, {
          fontSize: isTablet ? 24 : isSmallScreen ? 16 : 20,
          marginBottom: isTablet ? 40 : isSmallScreen ? 25 : 35,
        }]}>
          Belajar Biologi dengan Cara yang Menyenangkan!
        </Text>

        {/* Start Button */}
        <View style={styles.buttonContainer}>
          <GameButton
            title="Mulai Belajar"
            onPress={onStart}
            variant="primary"
            size={isTablet ? "large" : isSmallScreen ? "medium" : "large"}
            icon={<Text style={[styles.buttonIcon, {
              fontSize: isTablet ? 20 : isSmallScreen ? 14 : 16,
            }]}>▶️</Text>}
          />
        </View>

        {/* Version info */}
        <Text style={[styles.version, {
          fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
        }]}>Versi {Config.APP_VERSION}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.GAME_THEME.BACKGROUND,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    top: -100,
    left: -100,
  },
  circle2: {
    backgroundColor: Config.GAME_THEME.SECONDARY_COLOR,
    bottom: -75,
    right: -75,
  },
  circle3: {
    backgroundColor: Config.GAME_THEME.ACCENT_COLOR,
    top: height * 0.3,
    right: -50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.8, // Ensure minimum usable height
  },
  logoContainer: {
    marginBottom: width > 900 ? 30 : width < 700 ? 15 : 20,
  },
  logo: {
    backgroundColor: Config.GAME_THEME.CARD_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Config.GAME_THEME.SHADOW_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoEmoji: {
    // fontSize is handled inline
  },
  title: {
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    textAlign: 'center',
    fontFamily: Config.FONTS.TITLE,
  },
  subtitle: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
  },

  buttonContainer: {
    marginBottom: width > 900 ? 25 : width < 700 ? 15 : 20,
  },
  buttonIcon: {
    // fontSize is handled inline
  },
  version: {
    color: Config.GAME_THEME.TEXT_SECONDARY,
    opacity: 0.7,
  },
}); 