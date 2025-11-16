// CÓDIGO PARA O ARQUIVO: HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { getTrilhasWithUnlockStatus, debugTrilhasStatus, resetProgress, simularTrilha1Completa, getUserStats } from '../services/progressService';
import { getTrilhas } from '../services/contentService';
import { getDesafiosAtivos, getDesafiosDoUsuario } from '../services/desafiosService';
import { buscarDadosPerfil } from '../services/userService';
import { auth } from '../services/firebaseConfig';
import { testSyncSimple, cleanupTestDataSimple } from '../services/testSyncSimple';
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
  const strokeColor = isCompleted ? '#18AD77' : '#FFD700';

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

// Conector vertical estilizado entre os nós da trilha
const TrailConnectorSegment = ({ variant = 'pending', styleSet }) => {
  const palette = {
    ready: { line: '#F59E0B', dot: '#FBBF24', glow: 'rgba(251, 191, 36, 0.35)' },
    active: { line: '#38BDF8', dot: '#0EA5E9', glow: 'rgba(56, 189, 248, 0.3)' },
    done: { line: '#22C55E', dot: '#16A34A', glow: 'rgba(34, 197, 94, 0.35)' },
    locked: { line: '#475569', dot: '#94A3B8', glow: 'rgba(148, 163, 184, 0.25)' },
    pending: { line: '#334155', dot: '#64748B', glow: 'rgba(100, 116, 139, 0.25)' },
  };

  const colors = palette[variant] || palette.pending;

  return (
    <View style={styleSet.trailConnectorWrapper}>
      <View style={[styleSet.trailConnectorLine, { backgroundColor: colors.line }]} />
      <View style={[styleSet.trailConnectorGlow, { shadowColor: colors.line, backgroundColor: colors.glow }]} />
      <View style={[styleSet.trailConnectorDot, { backgroundColor: colors.dot, shadowColor: colors.dot }]} />
    </View>
  );
};

// Componente de Header com Streak
const HeaderWithStreak = ({ userName = "Jovem Financista", streak = 7, xp = 0, trilhasConcluidas = 0, totalTrilhas = 0, onReset, onSimulate, onTestSync, onCleanupTest }) => {
  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: '#101B38',
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 24,
      overflow: 'hidden',
    },
    aurora: {
      ...StyleSheet.absoluteFillObject,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTextBlock: {
      flex: 1,
    },
    welcomeText: {
      fontSize: 16,
      color: '#94A3B8',
      fontFamily: 'Outfit-Regular',
    },
    userName: {
      fontSize: 24,
      color: '#FFFFFF',
      fontFamily: 'Outfit-Bold',
      marginTop: 2,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 118, 110, 0.35)',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: 'rgba(45, 212, 191, 0.4)',
    },
    streakText: {
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
      color: '#5DF1CE',
      marginLeft: 6,
    },
    quickStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    quickStat: {
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      borderRadius: 16,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flex: 1,
      marginRight: 10,
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.2)',
    },
    quickStatLast: {
      marginRight: 0,
    },
    statLabel: {
      fontSize: 12,
      color: '#94A3B8',
      fontFamily: 'Outfit-Regular',
    },
    statValue: {
      fontSize: 18,
      color: '#FFFFFF',
      fontFamily: 'Outfit-Bold',
      marginTop: 4,
    },
    testButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
    },
    testButton: {
      backgroundColor: 'rgba(148, 163, 184, 0.15)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.4)',
      marginRight: 8,
      marginBottom: 8,
    },
    testButtonText: {
      color: '#E2E8F0',
      fontSize: 12,
      fontFamily: 'Outfit-Bold',
    },
  });

  return (
    <View style={styles.headerContainer}>
      <Svg style={styles.aurora} height="140" width="100%">
        <Defs>
          <LinearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.5" />
            <Stop offset="50%" stopColor="#34D399" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#A855F7" stopOpacity="0.4" />
          </LinearGradient>
        </Defs>
        <Path d="M0 80 Q120 10 240 80 T480 60 L480 140 L0 140 Z" fill="url(#aurora)" opacity="0.8" />
      </Svg>
      <View style={styles.headerContent}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.welcomeText}>Modo estudante ativado</Text>
          <Text style={styles.userName}>Olá, {userName}! 👋</Text>
        </View>
        <View style={styles.streakContainer}>
          <MaterialIcons name="whatshot" size={18} color="#FCD34D" />
          <Text style={styles.streakText}>{streak} dias</Text>
        </View>
      </View>
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.statLabel}>XP acumulado</Text>
          <Text style={styles.statValue}>{xp}</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.statLabel}>Trilhas</Text>
          <Text style={styles.statValue}>{trilhasConcluidas}/{totalTrilhas}</Text>
        </View>
        <View style={[styles.quickStat, styles.quickStatLast]}>
          <Text style={styles.statLabel}>Foco diário</Text>
          <Text style={styles.statValue}>{Math.max(streak, 1)} min</Text>
        </View>
      </View>
      <View style={styles.testButtons}>
        <TouchableOpacity style={styles.testButton} onPress={onReset}>
          <Text style={styles.testButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={onSimulate}>
          <Text style={styles.testButtonText}>Simular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.testButton, { borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)' }]} onPress={onTestSync}>
          <Text style={styles.testButtonText}>Test Sync</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.testButton, { borderColor: '#F87171', backgroundColor: 'rgba(248, 113, 113, 0.2)' }]} onPress={onCleanupTest}>
          <Text style={styles.testButtonText}>Cleanup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const navigationHook = useNavigation();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Estados para animações
  const [trilhas, setTrilhas] = useState([]);
  
  // Estados para trilhas com status de desbloqueio
  const [trilhasComStatus, setTrilhasComStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desafios, setDesafios] = useState([]);
  const [desafiosUsuario, setDesafiosUsuario] = useState([]);
  const [userData, setUserData] = useState({
    name: "Jovem Financista",
    primeiroNome: "Jovem",
    streak: 7,
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
        const trilhasData = await getTrilhas();
        setTrilhas(trilhasData);
        const status = await getTrilhasWithUnlockStatus();
        // Reordena por ordem para evitar "fora de ordem" na UI
        status.sort((a, b) => (trilhasData.find(t => t.id === a.id)?.ordem ?? 999) - (trilhasData.find(t => t.id === b.id)?.ordem ?? 999));
        setTrilhasComStatus(status);
        await debugTrilhasStatus();
        
        // carrega desafios (missões)
        const ativos = await getDesafiosAtivos();
        const meus = await getDesafiosDoUsuario();
        setDesafios(ativos);
        setDesafiosUsuario(meus);

        // Carregar dados do usuário do Firestore
        const uid = auth.currentUser?.uid;
        if (uid) {
          const stats = await getUserStats();
          const perfilResult = await buscarDadosPerfil(uid);
          if (perfilResult.success) {
            setUserData({
              name: perfilResult.data.nome || 'Jovem Financista',
              primeiroNome: perfilResult.data.primeiroNome || perfilResult.data.nome?.split(' ')[0] || 'Jovem',
              streak: 7, // TODO: implementar streak real
              totalTrilhas: stats.totalTrilhas,
              trilhasConcluidas: stats.trilhasConcluidas,
              xp: stats.xp,
            });
          }
        }

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
          
          // Recarregar XP e stats do usuário
          const uid = auth.currentUser?.uid;
          if (uid) {
            const stats = await getUserStats();
            const perfilResult = await buscarDadosPerfil(uid);
            if (perfilResult.success) {
              setUserData({
                name: perfilResult.data.nome || 'Jovem Financista',
                primeiroNome: perfilResult.data.primeiroNome || perfilResult.data.nome?.split(' ')[0] || 'Jovem',
                streak: 7,
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
      Alert.alert(
        'Confirmar Reset',
        'Tem certeza que deseja resetar todo o seu progresso? Esta ação não pode ser desfeita.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Resetar',
            style: 'destructive',
            onPress: async () => {
              try {
                const result = await resetProgress();
                if (result) {
                  // Recarregar status das trilhas
                  const status = await getTrilhasWithUnlockStatus();
                  setTrilhasComStatus(status);
                  
                  // Recarregar dados do usuário
                  const uid = auth.currentUser?.uid;
                  if (uid) {
                    const stats = await getUserStats();
                    const perfilResult = await buscarDadosPerfil(uid);
                    if (perfilResult.success) {
                      setUserData(prev => ({
                        ...prev,
                        totalTrilhas: stats.totalTrilhas,
                        trilhasConcluidas: stats.trilhasConcluidas,
                        xp: stats.xp,
                      }));
                    }
                  }
                  
                  Alert.alert('✅ Sucesso', 'Progresso resetado com sucesso!');
                } else {
                  Alert.alert('❌ Erro', 'Falha ao resetar progresso');
                }
              } catch (error) {
                console.error('Erro no reset:', error);
                Alert.alert('❌ Erro', `Falha ao resetar progresso: ${error.message}`);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro no handleReset:', error);
      Alert.alert('❌ Erro', `Erro inesperado: ${error.message}`);
    }
  };

  const handleSimulate = async () => {
    try {
      // Simulação progressiva: encontra a primeira trilha com progresso < 100 e marca como concluída (história + questões)
      const ordered = [...trilhas].sort((a,b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
      const status = await getTrilhasWithUnlockStatus();
      const aberto = ordered.find(t => (status.find(s => s.id === t.id)?.progresso || 0) < 100);
      if (!aberto) {
        Alert.alert('ℹ️ Info', 'Todas as trilhas já estão completas.');
        return;
      }
      
      // Reutiliza a função existente para T1 se for trilha_01, caso contrário completa via progresso local
      let success = false;
      if (aberto.id === 'trilha_01') {
        success = await simularTrilha1Completa();
      } else {
        // Marca como completa no progresso local
        const { loadUserProgress, saveUserProgress, calculateTrilhaProgress } = await import('../services/progressService');
        const prog = await loadUserProgress();
        if (!prog.historiasConcluidas.includes(aberto.id)) {
          prog.historiasConcluidas.push(aberto.id);
        }
        // Marca questões da trilha como completadas pelo padrão de ids (questao_trilha_X_...)
        const { getDocs, collection, query, where } = await import('firebase/firestore');
        const { db } = await import('../services/firebaseConfig');
        const qs = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', aberto.id)));
        qs.docs.forEach(d => {
          if (!prog.questoesCompletadas.some(q => q.id === d.id)) {
            prog.questoesCompletadas.push({ 
              id: d.id, 
              trilhaId: aberto.id,
              pontuacao: 10, 
              correta: true,
              respostaSelecionada: 1,
              dataConclusao: new Date().toISOString() 
            });
          }
        });
        await saveUserProgress(prog);
        await calculateTrilhaProgress(aberto.id);
        success = true;
      }
      
      if (success) {
        // Recarregar status das trilhas
        const novo = await getTrilhasWithUnlockStatus();
        setTrilhasComStatus(novo);
        
        // Recarregar dados do usuário
        const uid = auth.currentUser?.uid;
        if (uid) {
          const stats = await getUserStats();
          const perfilResult = await buscarDadosPerfil(uid);
          if (perfilResult.success) {
            setUserData(prev => ({
              ...prev,
              totalTrilhas: stats.totalTrilhas,
              trilhasConcluidas: stats.trilhasConcluidas,
              xp: stats.xp,
            }));
          }
        }
        
        Alert.alert('✅ Sucesso', `Trilha simulada como completa: ${aberto.titulo}`);
      } else {
        Alert.alert('❌ Erro', 'Falha ao simular trilha');
      }
    } catch (error) {
      console.error('Erro no handleSimulate:', error);
      Alert.alert('❌ Erro', `Falha ao simular trilha: ${error.message}`);
    }
  };

  // Função de teste de sincronização
  const handleTestSync = async () => {
    try {
      const result = await testSyncSimple();
      
      if (result.success) {
        // Recarregar dados após teste
        const status = await getTrilhasWithUnlockStatus();
        setTrilhasComStatus(status);
        
        const uid = auth.currentUser?.uid;
        if (uid) {
          const stats = await getUserStats();
          setUserData(prev => ({
            ...prev,
            totalTrilhas: stats.totalTrilhas,
            trilhasConcluidas: stats.trilhasConcluidas,
            xp: stats.xp,
          }));
        }
        
        Alert.alert(
          '✅ Teste Concluído',
          `Teste de sincronização realizado com sucesso!\n\nUsuário: ${result.user}\nSincronização: ${result.syncResult ? 'OK' : 'Falhou'}\nSalvamento: ${result.saveResult ? 'OK' : 'Falhou'}`
        );
      } else {
        Alert.alert('❌ Erro no Teste', result.message || result.error || 'Falha ao executar teste de sincronização');
      }
    } catch (error) {
      console.error('Erro no handleTestSync:', error);
      Alert.alert('❌ Erro', `Erro ao executar teste: ${error.message}`);
    }
  };

  // Função de limpeza de dados de teste
  const handleCleanupTest = async () => {
    try {
      Alert.alert(
        '🧹 Limpar Dados de Teste',
        'Deseja remover os dados de teste criados durante os testes de sincronização?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Limpar',
            style: 'destructive',
            onPress: async () => {
              const result = await cleanupTestDataSimple();
              
              if (result) {
                // Recarregar dados após limpeza
                const status = await getTrilhasWithUnlockStatus();
                setTrilhasComStatus(status);
                
                const uid = auth.currentUser?.uid;
                if (uid) {
                  const stats = await getUserStats();
                  setUserData(prev => ({
                    ...prev,
                    totalTrilhas: stats.totalTrilhas,
                    trilhasConcluidas: stats.trilhasConcluidas,
                    xp: stats.xp,
                  }));
                }
                
                Alert.alert('✅ Sucesso', 'Dados de teste removidos com sucesso!');
              } else {
                Alert.alert('ℹ️ Info', 'Nenhum dado de teste encontrado para remover.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro no handleCleanupTest:', error);
      Alert.alert('❌ Erro', `Erro ao limpar dados de teste: ${error.message}`);
    }
  };

  const styles = createResponsiveStyles(screenWidth, screenHeight);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18AD77" />
        <Text style={styles.loadingText}>Carregando sua jornada...</Text>
      </View>
    );
  }

  // Renderizar trilhas em layout responsivo no formato de jornada zigzag
  const renderTrilhasResponsive = () => {
    const ordered = [...trilhas].sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));

    return ordered.map((trilha, index) => {
      const trilhaStatus = trilhasComStatus.find(t => t.id === trilha.id);
      const progresso = trilhaStatus?.progresso || 0;
      const desbloqueada = !!trilhaStatus?.desbloqueada;
      const trilhaComStatus = {
        ...trilha,
        bloqueada: !desbloqueada,
        progresso,
      };

      const isReady = desbloqueada && progresso === 0;
      const isActive = desbloqueada && progresso > 0 && progresso < 100;
      const isComplete = progresso === 100;
      const connectorVariant = isComplete ? 'done' : isActive ? 'active' : isReady ? 'ready' : 'locked';
      const side = index % 2 === 0 ? 'left' : 'right';

      return (
        <View
          key={trilha.id}
          style={[styles.journeyRow, side === 'left' ? styles.journeyRowLeft : styles.journeyRowRight]}
        >
          {index !== 0 && (
            <ZigzagConnector
              isCompleted={isComplete || isActive}
              index={index}
              screenWidth={screenWidth}
              isLeftToRight={side === 'right'}
            />
          )}

          <View style={[styles.journeyNode, side === 'left' ? styles.nodeLeft : styles.nodeRight]}>
            <TrilhaItem
              trilha={trilhaComStatus}
              onPress={() => handleTrilhaPress(trilhaComStatus)}
              layoutSide={side}
              highlightPulse={isReady}
            />

            {index < ordered.length - 1 && (
              <TrailConnectorSegment variant={connectorVariant} styleSet={styles} />
            )}
          </View>
        </View>
      );
    });
  };

  const progressPercentage = userData.totalTrilhas > 0
    ? (userData.trilhasConcluidas / userData.totalTrilhas)
    : 0;
  const progressPercentRounded = Math.min(100, Math.max(0, Math.round(progressPercentage * 100)));
  const remainingPercent = Math.max(0, 100 - progressPercentRounded);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.techBackdrop}>
        <View style={[styles.auroraBlob, styles.auroraBlobLeft]} />
        <View style={[styles.auroraBlob, styles.auroraBlobRight]} />
      </View>
      {/* Header com Streak */}
      <HeaderWithStreak
        userName={userData.primeiroNome}
        streak={userData.streak}
        xp={userData.xp}
        trilhasConcluidas={userData.trilhasConcluidas}
        totalTrilhas={userData.totalTrilhas}
        onReset={handleReset}
        onSimulate={handleSimulate}
        onTestSync={handleTestSync}
        onCleanupTest={handleCleanupTest}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Progresso Melhorada */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressBadge}>Trilha atual</Text>
                <Text style={styles.progressTitle}>Painel do estudante</Text>
              </View>
              <View style={styles.xpContainer}>
                <MaterialIcons name="star" size={18} color="#FCD34D" />
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
                  { width: `${progressPercentRounded}%` }
                ]}
              />
            </View>
            <View style={styles.progressMetaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Foco diário</Text>
                <Text style={styles.metaValue}>{Math.max(userData.streak, 1)} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Próxima meta</Text>
                <Text style={styles.metaValue}>{remainingPercent}%</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Modo</Text>
                <Text style={styles.metaValue}>Estudante</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.studyModeCard}>
          <View style={styles.studyModeHeader}>
            <Text style={styles.studyModeTitle}>Modo estudante</Text>
            <Feather name="headphones" size={18} color="#A5B4FC" />
          </View>
          <Text style={styles.studyModeText}>
            Ative sessões curtas com lembretes inteligentes e receba reforços visuais em tempo real.
          </Text>
          <View style={styles.studyModeTags}>
            <View style={styles.studyModeChip}>
              <Text style={styles.studyModeChipText}>Pomodoro 10min</Text>
            </View>
            <View style={styles.studyModeChip}>
              <Text style={styles.studyModeChipText}>Notas automáticas</Text>
            </View>
          </View>
        </View>

        {/* Trilhas em Layout Responsivo */}
        <View style={styles.trilhasSection}>
          <Text style={styles.trilhasTitle}>Sua jornada financeira</Text>
          <Text style={styles.sectionSubtitle}>Continue desbloqueando trilhas e conquistas brilhantes.</Text>
          <View style={styles.trilhasContainer}>
            {renderTrilhasResponsive()}
          </View>
        </View>

        {/* Desafios (missões) */}
        {desafios?.length > 0 && (
          <View style={styles.trilhasSection}>
            <Text style={styles.trilhasTitle}>Missões em tempo real</Text>
            <Text style={styles.sectionSubtitle}>Complete desafios rápidos e ganhe reforços extras.</Text>
            {desafios.map((d) => {
              const meu = desafiosUsuario.find(x => x.id === d.id);
              const progresso = Math.min(1, Math.max(0, meu?.progresso ?? (meu?.concluido ? 1 : 0)));
              return (
                <View
                  key={d.id}
                  style={[styles.missionCard, meu?.concluido && styles.missionCardDone]}
                >
                  <View style={styles.missionIconBubble}>
                    <MaterialIcons
                      name={meu?.concluido ? 'emoji-events' : 'flag'}
                      size={18}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.missionContent}>
                    <Text style={styles.missionTitle}>{d.titulo}</Text>
                    <Text style={styles.missionDescription}>{d.descricao}</Text>
                    <View style={styles.missionProgressBar}>
                      <View
                        style={[styles.missionProgressFill, { width: `${progresso * 100}%` }]}
                      />
                    </View>
                  </View>
                  <View style={[styles.missionStatus, meu?.concluido && styles.missionStatusDone]}>
                    <Text style={styles.missionStatusText}>
                      {meu?.concluido ? 'Concluído' : 'Ativo'}
                    </Text>
                  </View>
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
      backgroundColor: '#050A1B',
    },
    techBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#050A1B',
    },
    auroraBlob: {
      position: 'absolute',
      width: screenWidth * 0.8,
      height: screenWidth * 0.8,
      borderRadius: screenWidth * 0.4,
      opacity: 0.35,
      backgroundColor: '#22D3EE',
      transform: [{ scale: 1.2 }],
    },
    auroraBlobLeft: {
      top: -screenWidth * 0.2,
      left: -screenWidth * 0.3,
      backgroundColor: '#34D399',
    },
    auroraBlobRight: {
      top: screenWidth * 0.1,
      right: -screenWidth * 0.3,
      backgroundColor: '#6366F1',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#050A1B',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#A7F3D0',
      fontFamily: 'Outfit-Regular',
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      paddingTop: 20,
    },
    progressSection: {
      marginBottom: 20,
      marginTop: 10,
    },
    progressCard: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressBadge: {
      fontSize: 12,
      fontFamily: 'Outfit-Bold',
      color: '#A5B4FC',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    progressTitle: {
      fontSize: 20,
      fontFamily: 'Outfit-Bold',
      color: '#F8FAFC',
      marginTop: 4,
    },
    xpContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(251, 191, 36, 0.15)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    xpText: {
      fontSize: 14,
      fontFamily: 'Outfit-Bold',
      color: '#FFE082',
      marginLeft: 4,
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#CBD5F5',
      marginBottom: 12,
      marginTop: 6,
    },
    progressBar: {
      height: 10,
      backgroundColor: 'rgba(148, 163, 184, 0.2)',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 14,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#34D399',
      borderRadius: 10,
    },
    progressMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    metaItem: {
      flex: 1,
      marginRight: 10,
    },
    metaLabel: {
      fontSize: 12,
      fontFamily: 'Outfit-Regular',
      color: '#94A3B8',
    },
    metaValue: {
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
      color: '#F8FAFC',
      marginTop: 4,
    },
    studyModeCard: {
      backgroundColor: 'rgba(15, 118, 110, 0.15)',
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.3)',
      marginBottom: 24,
    },
    studyModeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    studyModeTitle: {
      fontSize: 18,
      fontFamily: 'Outfit-Bold',
      color: '#5DF1CE',
    },
    studyModeText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#E0F2FE',
      lineHeight: 20,
      marginBottom: 10,
    },
    studyModeTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    studyModeChip: {
      backgroundColor: 'rgba(45, 212, 191, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(45, 212, 191, 0.4)',
      marginRight: 8,
      marginBottom: 8,
    },
    studyModeChipText: {
      fontSize: 12,
      fontFamily: 'Outfit-Bold',
      color: '#CCFBF1',
    },
    trilhasSection: {
      marginBottom: 30,
    },
    trilhasTitle: {
      fontSize: 22,
      fontFamily: 'Outfit-Bold',
      color: '#F8FAFC',
      marginBottom: 8,
      textAlign: 'left',
    },
    sectionSubtitle: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#94A3B8',
      marginBottom: 16,
      textAlign: 'left',
    },
    trilhasContainer: {
      paddingVertical: 10,
    },
    journeyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
      width: '100%',
      minHeight: 160,
    },
    journeyRowLeft: {
      justifyContent: 'flex-start',
      paddingLeft: 8,
      paddingRight: 26,
    },
    journeyRowRight: {
      justifyContent: 'flex-end',
      paddingLeft: 26,
      paddingRight: 8,
    },
    journeyNode: {
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(56, 189, 248, 0.25)',
      paddingVertical: 14,
      paddingHorizontal: 18,
      width: '78%',
      shadowColor: '#0EA5E9',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 14,
      elevation: 6,
    },
    nodeLeft: {
      borderLeftWidth: 2,
      borderLeftColor: 'rgba(101, 217, 255, 0.4)',
      transform: [{ translateX: -12 }],
    },
    nodeRight: {
      borderRightWidth: 2,
      borderRightColor: 'rgba(255, 200, 87, 0.45)',
      transform: [{ translateX: 12 }],
    },
    trailConnectorWrapper: {
      width: 36,
      height: 74,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    trailConnectorLine: {
      position: 'absolute',
      width: 4,
      height: 64,
      borderRadius: 10,
      opacity: 0.9,
    },
    trailConnectorGlow: {
      position: 'absolute',
      width: 30,
      height: 64,
      borderRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 12,
      opacity: 0.6,
    },
    trailConnectorDot: {
      position: 'absolute',
      bottom: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
    },
    missionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    missionCardDone: {
      borderColor: 'rgba(16, 185, 129, 0.5)',
      backgroundColor: 'rgba(6, 95, 70, 0.6)',
    },
    missionIconBubble: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: 'rgba(99, 102, 241, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    missionContent: {
      flex: 1,
    },
    missionTitle: {
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
      color: '#F8FAFC',
    },
    missionDescription: {
      fontSize: 13,
      fontFamily: 'Outfit-Regular',
      color: '#CBD5F5',
      marginTop: 4,
      marginBottom: 10,
    },
    missionProgressBar: {
      height: 6,
      backgroundColor: 'rgba(148, 163, 184, 0.3)',
      borderRadius: 6,
      overflow: 'hidden',
    },
    missionProgressFill: {
      height: '100%',
      backgroundColor: '#22D3EE',
    },
    missionStatus: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    missionStatusDone: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgba(16, 185, 129, 0.6)',
    },
    missionStatusText: {
      fontSize: 12,
      fontFamily: 'Outfit-Bold',
      color: '#E2E8F0',
    },
  });
};

export default HomeScreen;