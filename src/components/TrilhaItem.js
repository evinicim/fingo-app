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

const TrilhaItem = ({ trilha, onPress, layoutSide = 'center', highlightPulse = false }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

  // Animações
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const haloAnim = useRef(new Animated.Value(0.9)).current;

  const getTrilhaState = () => {
    if (trilha.bloqueada) return 'locked';
    if (trilha.progresso === 100) return 'completed';
    if (trilha.progresso > 0) return 'in_progress';
    return 'available';
  };

  const state = getTrilhaState();
  const styles = createResponsiveStyles(isSmallScreen, isMediumScreen);

  // Animação de pulso para trilhas disponíveis / prontas
  useEffect(() => {
    if (state === 'available' || highlightPulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      const haloAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(haloAnim, {
            toValue: 1.25,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(haloAnim, {
            toValue: 0.9,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      haloAnimation.start();
    }
  }, [state, highlightPulse]);

  const getButtonColors = () => {
    switch (state) {
      case 'completed':
        return {
          bg: '#1DB954',
          border: '#0EA649',
          shadow: '#34D399',
          text: '#E8FFF5',
        };
      case 'in_progress':
        return {
          bg: '#2563EB',
          border: '#1D4ED8',
          shadow: '#60A5FA',
          text: '#E0EAFF',
        };
      case 'available':
        return {
          bg: '#FBBF24',
          border: '#F59E0B',
          shadow: '#FCD34D',
          text: '#1F2937',
        };
      case 'locked':
        return {
          bg: '#1E293B',
          border: '#334155',
          shadow: '#94A3B8',
          text: '#94A3B8',
        };
      default:
        return {
          bg: '#FBBF24',
          border: '#F59E0B',
          shadow: '#FCD34D',
          text: '#1F2937',
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
        return '#1F2937';
      case 'locked':
        return '#94A3B8';
      default:
        return '#1F2937';
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

  const sideOffset = layoutSide === 'left' ? -16 : layoutSide === 'right' ? 16 : 0;

  return (
    <View
      style={[
        styles.trilhaContainer,
        layoutSide === 'left' && styles.alignLeft,
        layoutSide === 'right' && styles.alignRight,
      ]}
    >
      <Text style={[styles.titulo, state === 'locked' && styles.lockedText]}>
        {trilha.titulo}
      </Text>
      <Text style={styles.subtitulo}>
        Seção {trilha.ordem ? `#${trilha.ordem}` : 'ativa'}
      </Text>

      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleAnim }, { scale: state === 'available' || highlightPulse ? pulseAnim : 1 }], marginLeft: sideOffset },
        ]}
      >
        {(state === 'available' || highlightPulse) && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glowRing,
              {
                transform: [{ scale: haloAnim }],
                shadowColor: getButtonColors().shadow,
                backgroundColor: 'rgba(252, 211, 77, 0.2)',
              },
            ]}
          />
        )}

        <TouchableOpacity
          style={[
            styles.circularButton,
            {
              backgroundColor: getButtonColors().bg,
              borderColor: getButtonColors().border,
              shadowColor: getButtonColors().shadow,
            },
          ]}
          disabled={trilha.bloqueada}
          onPress={() => onPress && onPress(trilha)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.82}
        >
          <MaterialIcons name={getIconName()} size={30} color={getIconColor()} />
          <Text style={[styles.stateLabel, { color: getButtonColors().text }] }>
            {state === 'completed' && 'Feito'}
            {state === 'in_progress' && 'Retomar'}
            {state === 'available' && 'Continuar'}
            {state === 'locked' && 'Bloqueado'}
          </Text>

          {state === 'in_progress' && (
            <View style={styles.progressIndicator}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(8, trilha.progresso)}%` },
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
    width: 160,
    alignItems: 'center',
    marginBottom: 20,
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  titulo: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
    color: '#E2E8F0',
  },
  subtitulo: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Outfit-Regular',
    marginBottom: 6,
  },
  lockedText: {
    color: '#94A3B8',
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  circularButton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -17,
    left: -17,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    zIndex: -1,
  },
  stateLabel: {
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
    marginTop: 4,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: -10,
    left: 12,
    right: 12,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A5B4FC',
    borderRadius: 4,
  },
  completedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  progressBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.6)',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0EAFF',
    fontFamily: 'Outfit-Bold',
  },
});

export default TrilhaItem;
