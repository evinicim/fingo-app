import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Funções de responsividade personalizadas
const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

const TrilhaItem = ({ trilha, onPress }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  
  // Animações
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const getTrilhaState = () => {
    if (trilha.bloqueada) return 'locked';
    if (trilha.progresso === 100) return 'completed';
    if (trilha.progresso > 0) return 'in_progress';
    return 'available';
  };

  const state = getTrilhaState();
  const styles = createResponsiveStyles(isSmallScreen, isMediumScreen);
  
  // Animação de pulso para trilhas disponíveis
  useEffect(() => {
    if (state === 'available') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    }
  }, [state]);

  const getButtonColors = () => {
    switch (state) {
      case 'completed':
        return { 
          bg: '#18AD77', 
          border: '#128A5E',
          shadow: '#18AD77',
          gradient: ['#18AD77', '#128A5E']
        };
      case 'in_progress':
        return { 
          bg: '#4A90E2', 
          border: '#357ABD',
          shadow: '#4A90E2',
          gradient: ['#4A90E2', '#357ABD']
        };
      case 'available':
        return { 
          bg: '#FFD700', 
          border: '#FFC107',
          shadow: '#FFD700',
          gradient: ['#FFD700', '#FFC107']
        };
      case 'locked':
        return { 
          bg: '#E0E0E0', 
          border: '#BDBDBD',
          shadow: '#E0E0E0',
          gradient: ['#E0E0E0', '#BDBDBD']
        };
      default:
        return { 
          bg: '#FFD700', 
          border: '#FFC107',
          shadow: '#FFD700',
          gradient: ['#FFD700', '#FFC107']
        };
    }
  };

  const getIconName = () => {
    switch (state) {
      case 'completed':
        return 'check-circle';
      case 'in_progress':
        return 'play-circle-filled';
      case 'available':
        return 'play-circle-outline';
      case 'locked':
        return 'lock';
      default:
        return 'play-circle-outline';
    }
  };

  const getIconColor = () => {
    switch (state) {
      case 'completed':
        return '#FFFFFF';
      case 'in_progress':
        return '#FFFFFF';
      case 'available':
        return '#1A1A1A';
      case 'locked':
        return '#999999';
      default:
        return '#1A1A1A';
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.trilhaContainer}>
      <Text style={[styles.titulo, state === 'locked' && styles.lockedText]}>
        {trilha.titulo}
      </Text>
      
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [
              { scale: scaleAnim },
              { scale: state === 'available' ? pulseAnim : 1 }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.circularButton, 
            {
              backgroundColor: getButtonColors().bg,
              borderColor: getButtonColors().border,
              shadowColor: getButtonColors().shadow,
            }
          ]}
          disabled={trilha.bloqueada}
          onPress={() => onPress && onPress(trilha)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name={getIconName()} 
            size={28} 
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
        
        {/* Badges de conquista */}
        {state === 'completed' && (
          <View style={styles.completedBadge}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
          </View>
        )}
        
        {state === 'in_progress' && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{trilha.progresso}%</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const createResponsiveStyles = (isSmallScreen, isMediumScreen) => StyleSheet.create({
  trilhaContainer: {
    width: 120,
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
    color: '#1A1A1A',
  },
  lockedText: {
    color: '#999999',
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  circularButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: -8,
    left: 10,
    right: 10,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  completedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Outfit-Bold',
  },
});

export default TrilhaItem;