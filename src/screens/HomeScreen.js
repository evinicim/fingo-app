// CÓDIGO PARA O ARQUIVO: HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TRILHAS_MOCADAS } from '../data/mockdata';
import TrilhaItem from '../components/TrilhaItem'; // Importação correta

// Componente para linha conectora curva estilo Duolingo
const CurvedConnector = ({ isCompleted = false, index = 0, screenWidth }) => {
  // Padrões de linha mais orgânicos como no Duolingo
  const getPathData = (idx) => {
    const patterns = [
      `M 100 0 C 110 20 90 60 100 80`, // Curva suave para a direita
      `M 100 0 C 90 20 110 60 100 80`, // Curva suave para a esquerda
      `M 100 0 C 105 25 95 55 100 80`, // Curva sutil para a direita
      `M 100 0 C 95 25 105 55 100 80`, // Curva sutil para a esquerda
    ];
    // Altera o padrão a cada 2 trilhas para um visual mais dinâmico
    const patternIndex = Math.floor(idx / 2) % patterns.length;
    return patterns[patternIndex];
  };

  const pathData = getPathData(index);
  const strokeColor = isCompleted ? '#17D689' : '#FFD700';

  // O componente CurvedConnector PRECISA ter seu próprio StyleSheet
  const styles = StyleSheet.create({
    connectorContainer: {
      width: screenWidth * 0.5, // Largura responsiva
      height: 80,
      alignSelf: 'center',
      marginTop: -30,
      marginBottom: -30,
    },
  });

  return (
    <View style={styles.connectorContainer}>
      <Svg height="100%" width="100%">
        {/* Linha principal curva - mais grossa como no Duolingo */}
        <Path
          d={pathData}
          stroke={strokeColor}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos decorativos na linha */}
        <Circle cx="105" cy="30" r="2.5" fill="#4A90E2" />
        <Circle cx="95" cy="50" r="2" fill="#4A90E2" />
        <Circle cx="110" cy="45" r="1.5" fill="#4A90E2" />

        {/* Efeito de brilho sutil */}
        <Path
          d={pathData}
          stroke="#FFFFFF"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
      </Svg>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const navigationHook = useNavigation();

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    ...Feather.font,
    ...AntDesign.font,
  });

  // Revertemos a ordem das trilhas para começar de baixo para cima
  const trilhasInvertidas = [...TRILHAS_MOCADAS];

  const handleTrilhaPress = (trilha) => {
    if (trilha.bloqueada) {
      Alert.alert(
        "Trilha Bloqueada", 
        "Complete a trilha anterior para desbloquear esta trilha!",
        [{ text: "OK" }]
      );
      return;
    }
    
    Alert.alert(
      "Iniciar Trilha", 
      `Você está prestes a começar: ${trilha.titulo}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Começar", onPress: () => console.log("Iniciando trilha:", trilha.id) }
      ]
    );
  };

  const styles = createResponsiveStyles(screenWidth, screenHeight);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0AD58B" />
      </View>
    );
  }
  
  const trilhasComConectores = [];
  
  trilhasInvertidas.forEach((trilha, index) => {
    trilhasComConectores.push(
      <TrilhaItem
        key={trilha.id}
        trilha={trilha}
        onPress={() => handleTrilhaPress(trilha)}
      />
    );
    
    if (index < trilhasInvertidas.length - 1) {
      const isCompleted = trilha.progresso === 100;
      trilhasComConectores.push(
        <CurvedConnector
          key={`connector-${trilha.id}`}
          isCompleted={isCompleted}
          index={index}
          screenWidth={screenWidth}
        />
      );
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header da Home */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeTitle}>Bem-vindo ao Fingo!</Text>
          <Text style={styles.welcomeSubtitle}>Continue sua jornada de aprendizado</Text>
        </View>

        {/* Seção de Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Seu Progresso</Text>
            <Text style={styles.progressText}>Trilhas concluídas: 3 de 5</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        {/* Lista de Trilhas - Layout Linear Conectado */}
        <View style={styles.trilhasSection}>
          <Text style={styles.trilhasTitle}>Suas Trilhas</Text>
          <View style={styles.trilhasContainer}>
            {trilhasComConectores}
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
      backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    headerSection: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
    },
    welcomeTitle: {
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 35,
      color: '#000000',
      fontFamily: 'Outfit-Bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    welcomeSubtitle: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 20,
      color: '#666666',
      fontFamily: 'Outfit-Regular',
      textAlign: 'center',
    },
    progressSection: {
      marginBottom: 30,
    },
    progressCard: {
      backgroundColor: '#F1F8FF',
      borderColor: '#D9D9D9',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 60,
      elevation: 5,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 22,
      fontFamily: 'Outfit-Bold',
      color: '#000000',
      marginBottom: 8,
    },
    progressText: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 18,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      marginBottom: 12,
    },
    progressBar: {
      height: 8,
      backgroundColor: '#E5E5E5',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      width: '60%',
      backgroundColor: '#0AD58B',
      borderRadius: 4,
    },
    trilhasSection: {
      marginBottom: 20,
    },
    trilhasTitle: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 25,
      fontFamily: 'Outfit-Bold',
      color: '#000000',
      marginBottom: 16,
    },
    trilhasContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
  });
};

export default HomeScreen;