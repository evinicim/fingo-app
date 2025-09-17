import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const TrilhaItem = ({ trilha, alignment, onPress, showConnector = false }) => {
  // Obter dimensões da tela para responsividade
  const { width: screenWidth } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  
  // Determinar estado visual baseado no progresso e bloqueio
  const getTrilhaState = () => {
    if (trilha.bloqueada) return 'locked';
    if (trilha.progresso === 100) return 'completed';
    if (trilha.progresso > 0) return 'in_progress';
    return 'available';
  };

  const state = getTrilhaState();
  
  // Criar estilos responsivos
  const styles = createResponsiveStyles(isSmallScreen, isMediumScreen);
  
  // Estilos baseados no estado
  const getButtonStyle = () => {
    switch (state) {
      case 'completed':
        return styles.completedButton;
      case 'in_progress':
        return styles.inProgressButton;
      case 'available':
        return styles.availableButton;
      case 'locked':
        return styles.lockedButton;
      default:
        return styles.availableButton;
    }
  };

  // Cores baseadas no estado (como na imagem)
  const getButtonColors = () => {
    switch (state) {
      case 'completed':
        return { bg: '#FF9500', border: '#FFD700' }; // Laranja com borda dourada
      case 'in_progress':
        return { bg: '#4A90E2', border: '#357ABD' }; // Azul
      case 'available':
        return { bg: '#17D689', border: '#0AD58B' }; // Verde
      case 'locked':
        return { bg: '#E0E0E0', border: '#BDBDBD' }; // Cinza
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

  // Determinar alinhamento
  let alignmentStyle;
  if (alignment === 0) {
    alignmentStyle = staticStyles.alignLeft;
  } else if (alignment === 1) {
    alignmentStyle = staticStyles.alignCenter;
  } else {
    alignmentStyle = staticStyles.alignRight;
  }

  return (
    <View style={[staticStyles.trilhaContainer, alignmentStyle]}>
      {/* Linha conectora (se necessário) */}
      {showConnector && (
        <View style={staticStyles.connectorLine} />
      )}
      
      {/* Título da trilha */}
      <Text style={[styles.titulo, state === 'locked' && staticStyles.lockedText]}>
        {trilha.titulo}
      </Text>
      
      {/* Botão circular da trilha */}
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
        {/* Ícone baseado no estado */}
        <MaterialIcons 
          name={getIconName()} 
          size={isSmallScreen ? 28 : isMediumScreen ? 32 : 36} 
          color={getIconColor()} 
        />
        
        {/* Indicador de progresso (para trilhas em andamento) */}
        {state === 'in_progress' && (
          <View style={staticStyles.progressIndicator}>
            <View 
              style={[
                staticStyles.progressFill, 
                { width: `${trilha.progresso}%` }
              ]} 
            />
          </View>
        )}
      </TouchableOpacity>
      
      {/* Badge de progresso */}
      {state === 'completed' && (
        <View style={staticStyles.completedBadge}>
          <AntDesign name="star" size={12} color="#FFD700" />
        </View>
      )}
    </View>
  );
};

// Criar estilos responsivos
const createResponsiveStyles = (isSmallScreen, isMediumScreen) => StyleSheet.create({
  trilhaContainer: {
    width: 150,
    alignItems: 'center',
    position: 'relative',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  titulo: {
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
    fontWeight: '600',
    marginBottom: isSmallScreen ? 12 : 15,
    width: isSmallScreen ? 120 : isMediumScreen ? 135 : 150,
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
  // Estados dos botões (agora usando cores dinâmicas)
  // Linha conectora
  connectorLine: {
    position: 'absolute',
    top: 40,
    left: 60,
    width: 60,
    height: 2,
    backgroundColor: '#E0E0E0',
    zIndex: -1,
  },
  // Indicador de progresso
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
  // Badge de conquista
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

// Estilos estáticos (não responsivos)
const staticStyles = StyleSheet.create({
  trilhaContainer: {
    width: 150,
    alignItems: 'center',
    position: 'relative',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  alignCenter: {
    alignSelf: 'center',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  lockedText: {
    color: '#999999',
  },
  connectorLine: {
    position: 'absolute',
    top: 40,
    left: 60,
    width: 60,
    height: 2,
    backgroundColor: '#E0E0E0',
    zIndex: -1,
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