// CÓDIGO PARA O ARQUIVO: HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { TRILHAS_MOCADAS } from '../data/mockdata';
import { getTrilhasWithUnlockStatus, debugTrilhasStatus, resetProgress, simularTrilha1Completa } from '../services/progressService';
import TrilhaItem from '../components/TrilhaItem';
// Funções de responsividade simples
const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

// Componente para linha conectora em zigzag estilo Duolingo
const ZigzagConnector = ({ isCompleted = false, index = 0, screenWidth, isLeftToRight = true }) => {
  const getPathData = (isLeftToRight) => {
    if (isLeftToRight) {
      return `M 50 0 C 120 20 180 40 250 60 C 320 80 350 100 400 120`;
    } else {
      return `M 400 0 C 330 20 270 40 200 60 C 130 80 100 100 50 120`;
    }
  };

  const pathData = getPathData(isLeftToRight);
  const strokeColor = isCompleted ? '#58CC02' : '#FFD700';

  const styles = StyleSheet.create({
    connectorContainer: {
      width: screenWidth * 0.8,
      height: 120,
      alignSelf: 'center',
      marginTop: -60,
      marginBottom: -60,
    },
  });

  return (
    <View style={styles.connectorContainer}>
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
            <Stop offset="50%" stopColor={strokeColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        
        {/* Linha principal com gradiente */}
        <Path
          d={pathData}
          stroke="url(#connectorGradient)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos decorativos animados */}
        <Circle cx="200" cy="30" r="3" fill="#4A90E2" opacity="0.8" />
        <Circle cx="300" cy="70" r="2.5" fill="#4A90E2" opacity="0.6" />
        <Circle cx="150" cy="90" r="2" fill="#4A90E2" opacity="0.4" />
      </Svg>
    </View>
  );
};

// Componente de Header com Streak
const HeaderWithStreak = ({ userName = "Jovem Financista", streak = 7, onReset, onSimulate }) => {
  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: '#58CC02',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    testButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    testButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    testButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    welcomeText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: 'Outfit-Bold',
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    streakText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: 'Outfit-Bold',
      marginLeft: 5,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.welcomeText}>Olá, {userName}! 👋</Text>
        <View style={styles.streakContainer}>
          <AntDesign name="fire" size={16} color="#FFD700" />
          <Text style={styles.streakText}>{streak} dias</Text>
        </View>
      </View>
      <View style={styles.testButtons}>
        <TouchableOpacity style={styles.testButton} onPress={onReset}>
          <Text style={styles.testButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={onSimulate}>
          <Text style={styles.testButtonText}>Simular T1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const navigationHook = useNavigation();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Estados para animações
  const [pulseAnimations] = useState(
    TRILHAS_MOCADAS.map(() => new Animated.Value(1))
  );
  
  // Estados para trilhas com status de desbloqueio
  const [trilhasComStatus, setTrilhasComStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    ...Feather.font,
    ...AntDesign.font,
  });

  // Dados do usuário (simulados)
  const userData = {
    name: "Jovem Financista",
    streak: 7,
    totalTrilhas: TRILHAS_MOCADAS.length,
    trilhasConcluidas: trilhasComStatus.filter(t => t.progresso === 100).length,
    xp: 1250,
  };

  // Carregar status de desbloqueio das trilhas
  useEffect(() => {
    const loadTrilhasStatus = async () => {
      try {
        const status = await getTrilhasWithUnlockStatus();
        setTrilhasComStatus(status);
        
        // Debug para verificar status
        await debugTrilhasStatus();
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar status das trilhas:', error);
        setLoading(false);
      }
    };
    
    loadTrilhasStatus();
  }, []);

  // Recarregar status quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      const reloadStatus = async () => {
        try {
          const status = await getTrilhasWithUnlockStatus();
          setTrilhasComStatus(status);
        } catch (error) {
          console.error('Erro ao recarregar status das trilhas:', error);
        }
      };
      
      reloadStatus();
    }, [])
  );

  // Animação de pulso para trilhas disponíveis
  useEffect(() => {
    const pulseAnimation = () => {
      TRILHAS_MOCADAS.forEach((trilha, index) => {
        if (!trilha.bloqueada && trilha.progresso === 0) {
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnimations[index], {
                toValue: 1.1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnimations[index], {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
            ])
          ).start();
        }
      });
    };

    if (fontsLoaded) {
      pulseAnimation();
    }
  }, [fontsLoaded]);

  const handleTrilhaPress = (trilha) => {
    // Verificar se a trilha está desbloqueada
    const trilhaStatus = trilhasComStatus.find(t => t.id === trilha.id);
    
    if (!trilhaStatus?.desbloqueada) {
      Alert.alert(
        "🔒 Trilha Bloqueada", 
        "Complete a trilha anterior para desbloquear esta trilha!",
        [{ text: "Entendi", style: "default" }]
      );
      return;
    }
    
    // Navegar para a tela de História primeiro
    navigationHook.navigate('Historia', {
      trilhaId: trilha.id
    });
  };

  const handleReset = async () => {
    try {
      await resetProgress();
      const status = await getTrilhasWithUnlockStatus();
      setTrilhasComStatus(status);
      Alert.alert('Sucesso', 'Progresso resetado!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao resetar progresso');
    }
  };

  const handleSimulate = async () => {
    try {
      await simularTrilha1Completa();
      const status = await getTrilhasWithUnlockStatus();
      setTrilhasComStatus(status);
      Alert.alert('Sucesso', 'Trilha 1 simulada como completa!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao simular Trilha 1');
    }
  };

  const styles = createResponsiveStyles(screenWidth, screenHeight);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#58CC02" />
        <Text style={styles.loadingText}>Carregando sua jornada...</Text>
      </View>
    );
  }

  // Renderizar trilhas em layout responsivo
  const renderTrilhasResponsive = () => {
    return TRILHAS_MOCADAS.map((trilha, index) => {
      const trilhaStatus = trilhasComStatus.find(t => t.id === trilha.id);
      const trilhaComStatus = {
        ...trilha,
        bloqueada: !trilhaStatus?.desbloqueada,
        progresso: trilhaStatus?.progresso || 0
      };
      
      return (
        <Animated.View
          key={trilha.id}
          style={[
            styles.trilhaItemContainer,
            !trilhaComStatus.bloqueada && trilhaComStatus.progresso === 0 && {
              transform: [{ scale: pulseAnimations[index] }]
            }
          ]}
        >
          <TrilhaItem
            trilha={trilhaComStatus}
            onPress={() => handleTrilhaPress(trilhaComStatus)}
          />
        
          {/* Conector simples para próxima trilha */}
          {index < TRILHAS_MOCADAS.length - 1 && (
            <View style={styles.simpleConnector}>
              <View style={styles.connectorLine} />
              <View style={styles.connectorDot} />
            </View>
          )}
        </Animated.View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com Streak */}
      <HeaderWithStreak 
        userName={userData.name} 
        streak={userData.streak} 
        onReset={handleReset}
        onSimulate={handleSimulate}
      />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Progresso Melhorada */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Seu Progresso</Text>
              <View style={styles.xpContainer}>
                <MaterialIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.xpText}>{userData.xp} XP</Text>
              </View>
            </View>
            <Text style={styles.progressText}>
              {userData.trilhasConcluidas} de {userData.totalTrilhas} trilhas concluídas
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(userData.trilhasConcluidas / userData.totalTrilhas) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Trilhas em Layout Responsivo */}
        <View style={styles.trilhasSection}>
          <Text style={styles.trilhasTitle}>Sua Jornada Financeira</Text>
          <View style={styles.trilhasContainer}>
            {renderTrilhasResponsive()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createResponsiveStyles = (screenWidth, screenHeight) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F9FC',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F7F9FC',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#58CC02',
      fontFamily: 'Outfit-Regular',
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    progressSection: {
      marginBottom: 20,
      marginTop: 10,
    },
    progressCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#58CC02',
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
    },
    xpContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF3CD',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    xpText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#856404',
      marginLeft: 4,
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      marginBottom: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: '#E9ECEF',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#58CC02',
      borderRadius: 4,
    },
    trilhasSection: {
      marginBottom: 20,
    },
    trilhasTitle: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 20,
      textAlign: 'center',
    },
    trilhasContainer: {
      alignItems: 'center',
      paddingVertical: 10,
    },
    trilhaItemContainer: {
      alignItems: 'center',
      marginBottom: 15,
      width: '100%',
    },
    simpleConnector: {
      alignItems: 'center',
      marginVertical: 5,
    },
    connectorLine: {
      width: 2,
      height: 15,
      backgroundColor: '#58CC02',
      borderRadius: 1,
    },
    connectorDot: {
      width: 6,
      height: 6,
      backgroundColor: '#58CC02',
      borderRadius: 3,
      marginTop: 3,
    },
  });
};

export default HomeScreen;