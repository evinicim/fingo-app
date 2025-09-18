import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const TrilhaItem = ({ trilha, onPress }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  
  const getTrilhaState = () => {
    if (trilha.bloqueada) return 'locked';
    if (trilha.progresso === 100) return 'completed';
    if (trilha.progresso > 0) return 'in_progress';
    return 'available';
  };

  const state = getTrilhaState();
  const styles = createResponsiveStyles(isSmallScreen, isMediumScreen);
  
  const getButtonColors = () => {
    switch (state) {
      case 'completed':
        return { bg: '#FF9500', border: '#FFD700' };
      case 'in_progress':
        return { bg: '#4A90E2', border: '#357ABD' };
      case 'available':
        return { bg: '#17D689', border: '#0AD58B' };
      case 'locked':
        return { bg: '#E0E0E0', border: '#BDBDBD' };
      default:
        return { bg: '#17D689', border: '#0AD58B' };
    }
  };

  const getIconName = () => {
    switch (state) {
      case 'completed':
        return 'check';
      case 'in_progress':
        return 'play-arrow';
      case 'available':
        return 'play-arrow';
      case 'locked':
        return 'lock';
      default:
        return 'play-arrow';
    }
  };

  const getIconColor = () => {
    switch (state) {
      case 'completed':
        return '#FFFFFF';
      case 'in_progress':
        return '#FFFFFF';
      case 'available':
        return '#17D689';
      case 'locked':
        return '#999999';
      default:
        return '#17D689';
    }
  };

  return (
    <View style={styles.trilhaContainer}>
      <Text style={[styles.titulo, state === 'locked' && styles.lockedText]}>
        {trilha.titulo}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.circularButton, 
          {
            backgroundColor: getButtonColors().bg,
            borderColor: getButtonColors().border,
          }
        ]}
        disabled={trilha.bloqueada}
        onPress={() => onPress && onPress(trilha)}
        activeOpacity={0.8}
      >
        <MaterialIcons 
          name={getIconName()} 
          size={isSmallScreen ? 28 : isMediumScreen ? 32 : 36} 
          color={getIconColor()} 
        />
        
        {state === 'in_progress' && (
          <View style={styles.progressIndicator}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${trilha.progresso}%` }
              ]} 
            />
          </View>
        )}
      </TouchableOpacity>
      
      {state === 'completed' && (
        <View style={styles.completedBadge}>
          <AntDesign name="star" size={12} color="#FFD700" />
        </View>
      )}
    </View>
  );
};

const createResponsiveStyles = (isSmallScreen, isMediumScreen) => StyleSheet.create({
  trilhaContainer: {
    width: isSmallScreen ? 120 : isMediumScreen ? 140 : 150, // Largura responsiva
    alignItems: 'center',
    marginBottom: isSmallScreen ? 30 : 40, // Margem inferior ajustada para se conectar
  },
  titulo: {
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
    fontWeight: '600',
    marginBottom: isSmallScreen ? 12 : 15,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
    color: '#000000',
    lineHeight: isSmallScreen ? 18 : isMediumScreen ? 19 : 20,
  },
  lockedText: {
    color: '#999999',
  },
  circularButton: {
    width: isSmallScreen ? 90 : isMediumScreen ? 100 : 110,
    height: isSmallScreen ? 90 : isMediumScreen ? 100 : 110,
    borderRadius: isSmallScreen ? 45 : isMediumScreen ? 50 : 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: isSmallScreen ? 4 : 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: isSmallScreen ? 6 : 8 },
    shadowOpacity: 0.2,
    shadowRadius: isSmallScreen ? 10 : 15,
    elevation: isSmallScreen ? 8 : 12,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: -8,
    left: 10,
    right: 10,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#17D689',
    borderRadius: 2,
  },
  completedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default TrilhaItem;