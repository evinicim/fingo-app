// CÓDIGO PARA O ARQUIVO: HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { getTrilhasWithUnlockStatus, getUserStats } from '../services/progressService';
import { getTrilhas } from '../services/contentService';
import { getDesafiosAtivos, getDesafiosDoUsuario } from '../services/desafiosService';
import { buscarDadosPerfil } from '../services/userService';
import { auth } from '../services/firebaseConfig';
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

// Componente de Header
const HeaderWithActions = ({ userName = "Jovem Financista" }) => {
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
    welcomeText: {
      fontSize: 20,
      color: '#FFFFFF',
      fontFamily: 'Outfit-Bold',
    },
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.welcomeText}>Olá, {userName}!</Text>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const navigationHook = useNavigation();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Estados para animações
  const [pulseAnimations] = useState([]);
  const [trilhas, setTrilhas] = useState([]);
  
  // Estados para trilhas com status de desbloqueio
  const [trilhasComStatus, setTrilhasComStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desafios, setDesafios] = useState([]);
  const [desafiosUsuario, setDesafiosUsuario] = useState([]);
  const [userData, setUserData] = useState({
    name: "Jovem Financista",
    primeiroNome: "Jovem",
    totalTrilhas: 0,
    trilhasConcluidas: 0,
    xp: 0,
  });

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  // Carregar status de desbloqueio das trilhas e dados do usuário
  useEffect(() => {
    const loadTrilhasStatus = async () => {
      try {
        // Marcar início do carregamento
        const startTime = Date.now();
        // ENDPOINT: Iniciando carregamento da Home (teste de performance)
        // console.log('⏱️ Iniciando carregamento da Home...');
        
        const uid = auth.currentUser?.uid;
        
        // Carregar dados do cache primeiro (mais rápido)
        const { getCache } = require('../services/cacheService');
        const [cachedTrilhas, cachedPerfil, cachedStats] = await Promise.all([
          getCache('trilhas'),
          uid ? getCache('perfil', uid) : null,
          uid ? getCache('stats', uid) : null,
        ]);
        
        // Carregar trilhas (usar cache se disponível)
        const trilhasData = cachedTrilhas || await getTrilhas();
        setTrilhas(trilhasData);
        // inicializa animações conforme número de trilhas
        if (trilhasData?.length) {
          const anims = trilhasData.map(() => new Animated.Value(1));
          pulseAnimations.splice(0, pulseAnimations.length, ...anims);
        }

        // Carregar tudo em paralelo (não sequencial)
        const [status, ativos, meus, stats, perfilResult] = await Promise.all([
          getTrilhasWithUnlockStatus(),
          getDesafiosAtivos(),
          getDesafiosDoUsuario(),
          cachedStats || (uid ? getUserStats() : Promise.resolve({ totalTrilhas: 0, trilhasConcluidas: 0, xp: 0 })),
          cachedPerfil ? Promise.resolve({ success: true, data: cachedPerfil }) : (uid ? buscarDadosPerfil(uid) : Promise.resolve({ success: false })),
        ]);
        
        // Reordena por ordem para evitar "fora de ordem" na UI
        status.sort((a, b) => (trilhasData.find(t => t.id === a.id)?.ordem ?? 999) - (trilhasData.find(t => t.id === b.id)?.ordem ?? 999));
        setTrilhasComStatus(status);
        setDesafios(ativos);
        setDesafiosUsuario(meus);
        
        // Atualizar dados do usuário
        if (perfilResult.success) {
          const primeiroNome = perfilResult.data.primeiroNome || perfilResult.data.nome?.split(' ')[0] || 'Jovem';
          setUserData({
            name: perfilResult.data.nome || 'Jovem Financista',
            primeiroNome: primeiroNome,
            totalTrilhas: stats.totalTrilhas,
            trilhasConcluidas: stats.trilhasConcluidas,
            xp: stats.xp,
          });
        }

        setLoading(false);
        
        // Medir tempo de carregamento
        const loadTime = Date.now() - startTime;
        // ENDPOINT: Home carregada (teste de performance)
        // console.log(`✅ Home carregada em ${loadTime}ms`);
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
          
          // Recarregar XP e stats do usuário
          const uid = auth.currentUser?.uid;
          if (uid) {
            const stats = await getUserStats();
            const perfilResult = await buscarDadosPerfil(uid);
            if (perfilResult.success) {
              const primeiroNome = perfilResult.data.primeiroNome || perfilResult.data.nome?.split(' ')[0] || 'Jovem';
              setUserData({
                name: perfilResult.data.nome || 'Jovem Financista',
                primeiroNome: primeiroNome,
                totalTrilhas: stats.totalTrilhas,
                trilhasConcluidas: stats.trilhasConcluidas,
                xp: stats.xp,
              });
            }
          }
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
      const ordered = [...trilhas].sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
      ordered.forEach((trilha, index) => {
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
  }, [fontsLoaded, trilhas]);

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
    const ordered = [...trilhas].sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    return ordered.map((trilha, index) => {
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
          {index < trilhas.length - 1 && (
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
      {/* Header */}
      <HeaderWithActions 
        userName={userData.primeiroNome} 
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

        {/* Desafios (missões) */}
        {desafios?.length > 0 && (
          <View style={styles.trilhasSection}>
            <Text style={styles.trilhasTitle}>Desafios Ativos</Text>
            {desafios.map((d) => {
              const meu = desafiosUsuario.find(x => x.id === d.id);
              return (
                <View key={d.id} style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 10 }}>
                  <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 16, color: '#1A1A1A' }}>{d.titulo}</Text>
                  <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 12, color: '#666', marginTop: 4 }}>{d.descricao}</Text>
                  <Text style={{ fontFamily: 'Outfit-Regular', fontSize: 12, color: meu?.concluido ? '#58CC02' : '#999', marginTop: 8 }}>
                    {meu?.concluido ? 'Concluído' : 'Em andamento'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
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
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 18,
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