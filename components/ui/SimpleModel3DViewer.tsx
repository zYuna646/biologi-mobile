import { Config } from '@/constants/Config';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface SimpleModel3DViewerProps {
  modelSource: any;
  width?: number;
  height?: number;
  title?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const SimpleModel3DViewer: React.FC<SimpleModel3DViewerProps> = ({
  modelSource,
  width = screenWidth - 40,
  height = 300,
  title = "Model 3D"
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Background Gradient */}
      <View style={styles.background} />
      
      {/* 3D Placeholder Content */}
      <View style={styles.content}>
        {/* 3D Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon3D}>🎮</Text>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>Model 3D Interaktif</Text>
        
        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔄</Text>
            <Text style={styles.featureText}>Rotasi 360°</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureText}>Zoom Detail</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📐</Text>
            <Text style={styles.featureText}>Anatomi Akurat</Text>
          </View>
        </View>
        
        {/* Info Text */}
        <Text style={styles.infoText}>
          Model 3D akan menampilkan struktur anatomis secara detail dan interaktif.
        </Text>
        
        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Model tersedia</Text>
        </View>
      </View>
      
      {/* Corner Info */}
      <View style={styles.cornerInfo}>
        <Text style={styles.cornerText}>GLB</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: Config.GAME_THEME.PRIMARY_COLOR,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    backgroundColor: Config.GAME_THEME.PRIMARY_COLOR,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon3D: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Config.GAME_THEME.TEXT_PRIMARY,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Config.GAME_THEME.TEXT_SECONDARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 10,
    color: Config.GAME_THEME.TEXT_SECONDARY,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: Config.GAME_THEME.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Config.GAME_THEME.SECONDARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '500',
  },
  cornerInfo: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cornerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 