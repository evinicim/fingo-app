import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { enviarFeedback } from '../services/feedbackService';

// Funções de responsividade simples
const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

// Componente de animação de confete
const ConfettiAnimation = ({ isVisible }) => {
  const [animations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    if (isVisible) {
      animations.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const confettiStyles = StyleSheet.create({
    confettiContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      zIndex: 1,
    },
    confetti: {
      position: 'absolute',
      width: 12,
      height: 12,
      backgroundColor: '#FFD700',
      borderRadius: 2,
    },
  });

  return (
    <View style={confettiStyles.confettiContainer}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            confettiStyles.confetti,
            {
              left: `${20 + index * 15}%`,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 200],
                  }),
                },
                {
                  rotate: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
              opacity: anim,
            },
          ]}
        />
      ))}
    </View>
  );
};

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { questaoId, trilhaId, moduloId, respostaSelecionada, respostaCorreta, explicacao } = route.params;
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [animacao] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    Animated.spring(animacao, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    if (respostaCorreta) {
      setTimeout(() => setShowConfetti(true), 500);
    }
  }, []);

  const handleContinuar = () => {
    navigation.navigate('Desafios', { trilhaId, moduloId });
  };

  const handleAvaliar = async () => {
    try {
      await enviarFeedback({ tipo: 'questao', itemId: questaoId, rating: respostaCorreta ? 5 : 3 });
    } catch (_) {}
    handleContinuar();
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  const getPontuacao = () => {
    return respostaCorreta ? 10 : 0;
  };

  const getMensagemMotivacional = () => {
    if (respostaCorreta) {
      const mensagens = [
        "Excelente! Você está dominando o assunto! 🎯",
        "Parabéns! Continue assim! 🚀",
        "Muito bem! Seu conhecimento está crescendo! 📈",
        "Fantástico! Você acertou! ⭐",
        "Perfeito! Continue estudando! 💪"
      ];
      return mensagens[Math.floor(Math.random() * mensagens.length)];
    } else {
      const mensagens = [
        "Não desista! Continue tentando! 💪",
        "Errar faz parte do aprendizado! 📚",
        "A próxima será melhor! 🌟",
        "Continue estudando! Você consegue! 🎯",
        "Cada erro é uma oportunidade de aprender! 📖"
      ];
      return mensagens[Math.floor(Math.random() * mensagens.length)];
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F9FC',
    },
    header: {
      backgroundColor: '#18AD77',
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
    feedbackCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      alignItems: 'center',
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: respostaCorreta ? '#E8F5E8' : '#FFEBEE',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    feedbackTitle: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: respostaCorreta ? '#18AD77' : '#FF6B6B',
      marginBottom: 12,
      textAlign: 'center',
    },
    feedbackMessage: {
      fontSize: 16,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 20,
    },
    pontuacaoContainer: {
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      width: '100%',
    },
    pontuacaoTitle: {
      fontSize: 14,
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 8,
      textAlign: 'center',
    },
    pontuacaoValue: {
      fontSize: 32,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#58CC02',
      textAlign: 'center',
    },
    explicacaoContainer: {
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      width: '100%',
    },
    explicacaoTitle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 12,
    },
    explicacaoText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      lineHeight: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    continuarButton: {
      backgroundColor: '#18AD77',
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
    confettiContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      zIndex: 1,
    },
    confetti: {
      position: 'absolute',
      width: 12,
      height: 12,
      backgroundColor: '#FFD700',
      borderRadius: 2,
    },
  });

  if (!fontsLoaded) {
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
      {/* Confetti Animation */}
      <ConfettiAnimation isVisible={showConfetti} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Feedback</Text>
          <Text style={styles.headerSubtitle}>Resultado da Questão</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card de Feedback */}
        <Animated.View
          style={[
            styles.feedbackCard,
            {
              transform: [{ scale: animacao }]
            }
          ]}
        >
          {/* Ícone de Status */}
          <View style={styles.iconContainer}>
            <MaterialIcons
              name={respostaCorreta ? 'check-circle' : 'cancel'}
              size={40}
              color={respostaCorreta ? '#18AD77' : '#FF6B6B'}
            />
          </View>

          {/* Título */}
          <Text style={styles.feedbackTitle}>
            {respostaCorreta ? 'Parabéns!' : 'Que pena!'}
          </Text>

          {/* Mensagem Motivacional */}
          <Text style={styles.feedbackMessage}>
            {getMensagemMotivacional()}
          </Text>

          {/* Pontuação */}
          <View style={styles.pontuacaoContainer}>
            <Text style={styles.pontuacaoTitle}>Pontuação</Text>
            <Text style={styles.pontuacaoValue}>
              +{getPontuacao()} XP
            </Text>
          </View>

          {/* Explicação */}
          <View style={styles.explicacaoContainer}>
            <Text style={styles.explicacaoTitle}>Explicação</Text>
            <Text style={styles.explicacaoText}>
              {explicacao}
            </Text>
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.voltarButton]}
              onPress={handleVoltar}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.continuarButton]}
              onPress={handleAvaliar}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
