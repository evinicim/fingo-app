import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
// Correção aqui:
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { getQuestoesByModulo } from '../services/contentService';
import { markQuestaoAsCompleted, calculateTrilhaProgress } from '../services/progressService';

// Funções de responsividade simples
const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

// Componente para opção de resposta
const OpcaoResposta = ({ opcao, index, isSelected, isCorrect, isWrong, onPress, disabled }) => {
  const getOpcaoColor = () => {
    if (disabled) {
      if (isCorrect) return '#58CC02';
      if (isWrong) return '#FF6B6B';
      return '#E0E0E0';
    }
    if (isSelected) return '#4A90E2';
    return '#FFFFFF';
  };

  const getTextColor = () => {
    if (disabled) {
      if (isCorrect || isWrong) return '#FFFFFF';
      return '#999999';
    }
    if (isSelected) return '#FFFFFF';
    return '#1A1A1A';
  };

  const getBorderColor = () => {
    if (disabled) {
      if (isCorrect) return '#58CC02';
      if (isWrong) return '#FF6B6B';
      return '#E0E0E0';
    }
    if (isSelected) return '#4A90E2';
    return '#E0E0E0';
  };

  const styles = StyleSheet.create({
    opcaoContainer: {
      backgroundColor: getOpcaoColor(),
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: getBorderColor(),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: disabled ? 0.1 : 0.05,
      shadowRadius: 4,
      elevation: disabled ? 2 : 1,
    },
    opcaoContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    opcaoLetter: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: disabled ? 'rgba(255,255,255,0.2)' : '#4A90E2',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    opcaoLetterText: {
      fontSize: 16,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: disabled ? '#FFFFFF' : '#FFFFFF',
    },
    opcaoText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Outfit-Regular',
      color: getTextColor(),
      lineHeight: 22,
    },
    statusIcon: {
      marginLeft: 8,
    },
  });

  return (
    <TouchableOpacity
      style={styles.opcaoContainer}
      onPress={() => !disabled && onPress(index)}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={styles.opcaoContent}>
        <View style={styles.opcaoLetter}>
          <Text style={styles.opcaoLetterText}>
            {String.fromCharCode(65 + index)}
          </Text>
        </View>
        <Text style={styles.opcaoText}>{opcao}</Text>
        {disabled && (
          <View style={styles.statusIcon}>
            <MaterialIcons
              name={isCorrect ? "check-circle" : "cancel"}
              size={20}
              color={isCorrect ? "#58CC02" : "#FF6B6B"}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const QuestaoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { questaoId, trilhaId, moduloId } = route.params;
  
  const [questao, setQuestao] = useState(null);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [respostaCorreta, setRespostaCorreta] = useState(false);
  const [animacao] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    const load = async () => {
      if (moduloId) {
        const qs = await getQuestoesByModulo(moduloId);
        const q = questaoId ? qs.find(x => x.id === questaoId) : qs[0];
        if (q) {
          // normalizar campos para o componente atual
          setQuestao({
            id: q.id,
            trilhaTitulo: '',
            moduloTitulo: '',
            dificuldade: q.dificuldade || 'facil',
            pergunta: q.enunciado,
            opcoes: q.opcoes?.map(o => o.texto) || [],
            respostaCorreta: ['A','B','C','D'].indexOf(q.respostaCorreta),
            explicacao: q.explicacao || ''
          });
        }
      }
    };
    load();
  }, [questaoId, moduloId]);

  useEffect(() => {
    if (mostrarResultado) {
      Animated.spring(animacao, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [mostrarResultado]);

  const handleOpcaoPress = (index) => {
    if (mostrarResultado) return;
    setRespostaSelecionada(index);
  };

  const handleResponder = async () => {
    if (respostaSelecionada === null) {
      Alert.alert('Atenção', 'Selecione uma opção antes de responder!');
      return;
    }

    const isCorrect = respostaSelecionada === questao.respostaCorreta;
    setRespostaCorreta(isCorrect);
    setMostrarResultado(true);
    
    // Salvar progresso da questão e recalcular progresso da trilha
    try {
      const pontuacao = isCorrect ? 10 : 0;
      await markQuestaoAsCompleted(questao.id, trilhaId, respostaSelecionada, isCorrect, pontuacao);
      
      // Recalcular progresso da trilha
      await calculateTrilhaProgress(trilhaId);
    } catch (error) {
      console.error('Erro ao salvar progresso da questão:', error);
    }
  };

  const handleContinuar = () => {
    navigation.navigate('Feedback', {
      questaoId,
      trilhaId,
      moduloId,
      respostaSelecionada,
      respostaCorreta,
      explicacao: questao.explicacao
    });
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  const getDificuldadeColor = (dificuldade) => {
    switch (dificuldade) {
      case 'facil': return '#58CC02';
      case 'medio': return '#FFD700';
      case 'dificil': return '#FF6B6B';
      default: return '#58CC02';
    }
  };

  const getDificuldadeText = (dificuldade) => {
    switch (dificuldade) {
      case 'facil': return 'Fácil';
      case 'medio': return 'Médio';
      case 'dificil': return 'Difícil';
      default: return 'Fácil';
    }
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
    questaoCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    questaoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    questaoTitulo: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
    },
    dificuldadeBadge: {
      backgroundColor: getDificuldadeColor(questao?.dificuldade),
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    dificuldadeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: 'Outfit-Bold',
    },
    questaoPergunta: {
      fontSize: 18,
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      lineHeight: 26,
      marginBottom: 24,
    },
    opcoesContainer: {
      marginBottom: 24,
    },
    responderButton: {
      backgroundColor: '#58CC02',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    responderButtonDisabled: {
      backgroundColor: '#E0E0E0',
    },
    responderButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#FFFFFF',
    },
    resultadoContainer: {
      backgroundColor: respostaCorreta ? '#E8F5E8' : '#FFEBEE',
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      borderLeftWidth: 4,
      borderLeftColor: respostaCorreta ? '#58CC02' : '#FF6B6B',
    },
    resultadoTitle: {
      fontSize: 16,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: respostaCorreta ? '#58CC02' : '#FF6B6B',
      marginBottom: 8,
    },
    resultadoText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      lineHeight: 20,
    },
    continuarButton: {
      backgroundColor: '#4A90E2',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 16,
    },
    continuarButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#FFFFFF',
    },
  });

  if (!fontsLoaded || !questao) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Questão</Text>
          <Text style={styles.headerSubtitle}>
            {questao.trilhaTitulo} - {questao.moduloTitulo}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card da Questão */}
        <View style={styles.questaoCard}>
          <View style={styles.questaoHeader}>
            <Text style={styles.questaoTitulo}>
              Questão {questao.id.split('_').pop()}
            </Text>
            <View style={styles.dificuldadeBadge}>
              <Text style={styles.dificuldadeText}>
                {getDificuldadeText(questao.dificuldade)}
              </Text>
            </View>
          </View>

          <Text style={styles.questaoPergunta}>
            {questao.pergunta}
          </Text>

          {/* Opções de Resposta */}
          <View style={styles.opcoesContainer}>
            {questao.opcoes.map((opcao, index) => (
              <OpcaoResposta
                key={index}
                opcao={opcao}
                index={index}
                isSelected={respostaSelecionada === index}
                isCorrect={mostrarResultado && index === questao.respostaCorreta}
                isWrong={mostrarResultado && respostaSelecionada === index && !respostaCorreta}
                onPress={handleOpcaoPress}
                disabled={mostrarResultado}
              />
            ))}
          </View>

          {/* Botão Responder */}
          {!mostrarResultado && (
            <TouchableOpacity
              style={[
                styles.responderButton,
                respostaSelecionada === null && styles.responderButtonDisabled
              ]}
              onPress={handleResponder}
              disabled={respostaSelecionada === null}
            >
              <Text style={styles.responderButtonText}>
                Responder
              </Text>
            </TouchableOpacity>
          )}

          {/* Resultado */}
          {mostrarResultado && (
            <Animated.View
              style={[
                styles.resultadoContainer,
                {
                  transform: [{ scale: animacao }]
                }
              ]}
            >
              <Text style={styles.resultadoTitle}>
                {respostaCorreta ? '🎉 Parabéns!' : '❌ Que pena!'}
              </Text>
              <Text style={styles.resultadoText}>
                {questao.explicacao}
              </Text>
              
              <TouchableOpacity
                style={styles.continuarButton}
                onPress={handleContinuar}
              >
                <Text style={styles.continuarButtonText}>
                  Continuar
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestaoScreen;