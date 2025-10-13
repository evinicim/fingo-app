import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Animated, Image, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { TRILHAS_MOCADAS, getQuestoesByModulo } from '../data/mockdata';
import { markHistoriaAsCompleted, isHistoriaCompleted, calculateTrilhaProgress, getTrilhaProgress } from '../services/progressService';

// Funções de responsividade simples
const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

// Componente do Player de Vídeo
const VideoPlayer = ({ progress = 0, onPlayPress }) => {
  const isCompleted = progress >= 100;
  
  const styles = StyleSheet.create({
    videoContainer: {
      width: '100%',
      height: 200,
      backgroundColor: isCompleted ? '#58CC02' : '#2C2C2C',
      borderRadius: 16,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isCompleted ? '#FFFFFF' : '#58CC02',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#58CC02',
      width: `${progress}%`,
    },
    progressText: {
      position: 'absolute',
      bottom: 8,
      right: 12,
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: 'Outfit-Bold',
    },
    completedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(88, 204, 2, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    completedText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
      marginTop: 8,
    },
  });

  return (
    <TouchableOpacity style={styles.videoContainer} onPress={onPlayPress} activeOpacity={0.8}>
      {isCompleted ? (
        <View style={styles.completedOverlay}>
          <AntDesign name="checkcircle" size={40} color="#FFFFFF" />
          <Text style={styles.completedText}>Vídeo Concluído!</Text>
        </View>
      ) : (
        <View style={styles.playButton}>
          <AntDesign name="play" size={24} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
    </TouchableOpacity>
  );
};

// Componente do Mascote
const Mascot = ({ isVisible = true }) => {
  const [bounceAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      const bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      bounce.start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    mascotContainer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 10,
    },
    mascot: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#58CC02',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    crown: {
      position: 'absolute',
      top: -8,
      right: 8,
      width: 24,
      height: 16,
      backgroundColor: '#FFD700',
      borderRadius: 4,
    },
    cape: {
      position: 'absolute',
      bottom: -5,
      left: -5,
      width: 30,
      height: 20,
      backgroundColor: '#4A90E2',
      borderRadius: 8,
    },
  });

  return (
    <Animated.View
      style={[
        styles.mascotContainer,
        {
          transform: [
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.mascot}>
        <MaterialIcons name="pets" size={40} color="#FFFFFF" />
        <View style={styles.crown} />
        <View style={styles.cape} />
    </View>
    </Animated.View>
  );
};

const HistoriaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { trilhaId } = route.params;
  
  const [trilha, setTrilha] = useState(null);
  const [historiaConcluida, setHistoriaConcluida] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [progressoReal, setProgressoReal] = useState(0);
  const [animacao] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    const loadHistoriaState = async () => {
      if (trilhaId) {
        const trilhaData = TRILHAS_MOCADAS.find(t => t.id === trilhaId);
        setTrilha(trilhaData);
        
        // Verificar se a história foi concluída
        const historiaCompleta = await isHistoriaCompleted(trilhaId);
        setHistoriaConcluida(historiaCompleta);
        
        // Carregar progresso real da trilha
        const progresso = await getTrilhaProgress(trilhaId);
        setProgressoReal(progresso);
      }
    };
    
    loadHistoriaState();
  }, [trilhaId]);

  useEffect(() => {
    Animated.spring(animacao, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  // Recarregar progresso quando a tela ganha foco (volta das questões)
  useFocusEffect(
    React.useCallback(() => {
      const reloadProgress = async () => {
        if (trilhaId) {
          try {
            // Recalcular e atualizar progresso
            const novoProgresso = await calculateTrilhaProgress(trilhaId);
            setProgressoReal(novoProgresso);
            
            // Verificar se história ainda está concluída
            const historiaCompleta = await isHistoriaCompleted(trilhaId);
            setHistoriaConcluida(historiaCompleta);
          } catch (error) {
            console.error('Erro ao recarregar progresso:', error);
          }
        }
      };
      
      reloadProgress();
    }, [trilhaId])
  );

  const handleVideoPlay = () => {
    if (videoProgress >= 100) {
      // Reset do vídeo se já terminou
      setVideoProgress(0);
    }
    setIsVideoPlaying(true);
    // Simular progresso do vídeo
    const interval = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVideoPlaying(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleConcluirHistoria = async () => {
    try {
      // Marcar história como concluída no serviço de progresso
      const sucesso = await markHistoriaAsCompleted(trilhaId);
      
      if (sucesso) {
        setHistoriaConcluida(true);
        
        // Recalcular progresso da trilha
        const novoProgresso = await calculateTrilhaProgress(trilhaId);
        setProgressoReal(novoProgresso);
        
        // Mostrar feedback de sucesso
        Alert.alert(
          '🎉 Parabéns!',
          'História concluída! Agora você pode acessar os desafios!',
          [{ text: 'Continuar', style: 'default' }]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o progresso. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao concluir história:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const handleIrParaDesafios = () => {
    if (trilha && trilha.modulos) {
      const primeiroModulo = Object.keys(trilha.modulos)[0];
      navigation.navigate('Desafios', {
        trilhaId: trilha.id,
        moduloId: primeiroModulo
      });
    }
  };

  const handleVoltar = () => {
    navigation.goBack();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: '#F7F9FC',
    },
    header: {
      backgroundColor: '#58CC02',
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#FFFFFF',
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    historiaCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    historiaHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    historiaTitulo: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      textAlign: 'center',
      marginBottom: 8,
    },
    historiaDuracao: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      backgroundColor: '#F0F0F0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    historiaConteudo: {
      fontSize: 16,
      fontFamily: 'Outfit-Regular',
      color: '#333333',
      lineHeight: 24,
      marginBottom: 24,
    },
    statusContainer: {
      backgroundColor: historiaConcluida ? '#E8F5E8' : '#FFF3E0',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
    alignItems: 'center',
  },
    statusIcon: {
      marginRight: 12,
    },
    statusText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
      color: historiaConcluida ? '#58CC02' : '#FF9800',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    concluirButton: {
      backgroundColor: '#58CC02',
    },
    desafiosButton: {
      backgroundColor: '#4A90E2',
    },
    voltarButton: {
      backgroundColor: '#6C757D',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#FFFFFF',
    },
    desafiosButtonDisabled: {
      backgroundColor: '#E0E0E0',
    },
    desafiosButtonTextDisabled: {
      color: '#999999',
    },
    progressContainer: {
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 12,
    },
    progressBar: {
      height: 8,
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#58CC02',
      borderRadius: 4,
      width: '0%', // Será atualizado dinamicamente
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      marginTop: 8,
      textAlign: 'center',
  },
});

  if (!fontsLoaded || !trilha) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carregando...</Text>
        </View>
      </View>
    );
  }

  const questoesDisponiveis = trilha.modulos ? Object.values(trilha.modulos).reduce((total, modulo) => total + modulo.questoes.length, 0) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
          <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>História</Text>
          <Text style={styles.headerSubtitle}>{trilha.titulo}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Player de Vídeo */}
        <VideoPlayer 
          progress={videoProgress} 
          onPlayPress={handleVideoPlay}
        />

        {/* Card da História */}
        <Animated.View
          style={[
            styles.historiaCard,
            {
              transform: [{ scale: animacao }]
            }
          ]}
        >
          {/* Header da História */}
          <View style={styles.historiaHeader}>
            <Text style={styles.historiaTitulo}>
              {trilha.historia.titulo}
            </Text>
            <Text style={styles.historiaDuracao}>
              ⏱️ {trilha.historia.duracao}
            </Text>
          </View>

          {/* Conteúdo da História */}
          <Text style={styles.historiaConteudo}>
            {trilha.historia.conteudo}
          </Text>

          {/* Status da História */}
          <View style={styles.statusContainer}>
            <View style={styles.statusIcon}>
              <AntDesign
                name={historiaConcluida ? "checkcircle" : "clockcircle"}
                size={24}
                color={historiaConcluida ? "#58CC02" : "#FF9800"}
              />
            </View>
            <Text style={styles.statusText}>
              {historiaConcluida 
                ? "História concluída! Desafios liberados!" 
                : "Leia a história para liberar os desafios"
              }
            </Text>
          </View>

          {/* Progresso */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Progresso da Trilha</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressoReal}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progressoReal}% concluído • {questoesDisponiveis} questões disponíveis
            </Text>
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            {!historiaConcluida ? (
              <TouchableOpacity
                style={[styles.button, styles.concluirButton]}
                onPress={handleConcluirHistoria}
              >
                <Text style={styles.buttonText}>
                  Concluir História
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.desafiosButton]}
                onPress={handleIrParaDesafios}
              >
                <Text style={styles.buttonText}>
                  Ir para Desafios
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.voltarButton]}
              onPress={handleVoltar}
            >
              <Text style={styles.buttonText}>
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Mascote */}
      <Mascot isVisible={!historiaConcluida} />
    </SafeAreaView>
  );
};

export default HistoriaScreen;