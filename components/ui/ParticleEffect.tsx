import { Config } from '@/constants/Config';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';

interface ParticleEffectProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export const ParticleEffect: React.FC<ParticleEffectProps> = ({
  visible,
  onComplete,
}) => {
  const particles = useRef(
    Array.from({ length: 8 }, () => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Start particle animation
      const animations = particles.map((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const distance = 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;

        return Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateX, {
            toValue: endX,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: endY,
            duration: 800,
            useNativeDriver: true,
          }),
        ]);
      });

      // Fade out after explosion
      const fadeOut = particles.map((particle) =>
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 400,
          delay: 600,
          useNativeDriver: true,
        })
      );

      Animated.sequence([
        Animated.parallel(animations),
        Animated.parallel(fadeOut),
      ]).start(() => {
        // Reset particles
        particles.forEach((particle) => {
          particle.opacity.setValue(0);
          particle.translateX.setValue(0);
          particle.translateY.setValue(0);
          particle.scale.setValue(0);
        });
        onComplete?.();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
                { scale: particle.scale },
              ],
            },
          ]}
        >
          <View style={[styles.sparkle, { backgroundColor: index % 2 === 0 ? Config.GAME_THEME.PRIMARY_COLOR : Config.GAME_THEME.ACCENT_COLOR }]} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
  },
  sparkle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
}); 