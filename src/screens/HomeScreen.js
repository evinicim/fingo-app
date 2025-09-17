import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TRILHAS_MOCADAS } from '../data/mockdata';
import TrilhaItem from '../components/TrilhaItem';

// Componente para linha conectora curva estilo Duolingo
const CurvedConnector = ({ isCompleted = false, isLast = false, index = 0 }) => {
  if (isLast) return null;
  
  // Padrões de linha mais orgânicos como no Duolingo
  const getPathData = (idx) => {
    const patterns = [
      `M 100 50 Q 110 30 100 80`, // Curva suave para direita
      `M 100 50 Q 90 30 100 80`,  // Curva suave para esquerda
      `M 100 50 Q 105 25 100 80`, // Curva sutil direita
      `M 100 50 Q 95 25 100 80`,  // Curva sutil esquerda
      `M 100 50 Q 100 20 100 80`, // Curva acentuada
      `M 100 50 Q 115 35 100 80`, // Curva mais pronunciada direita
    ];
    return patterns[idx % patterns.length];
  };
  
  const pathData = getPathData(index);
  const strokeColor = isCompleted ? '#17D689' : '#FFD700';
  
  return (
    <Svg height="80" width="200" style={{ position: 'absolute', zIndex: 1 }}>
      {/* Linha principal curva - mais grossa como no Duolingo */}
      <Path
        d={pathData}
        stroke={strokeColor}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Pontos decorativos na linha - como no Duolingo */}
      <Circle cx="105" cy="40" r="3" fill="#4A90E2" />
      <Circle cx="95" cy="35" r="2" fill="#4A90E2" />
      <Circle cx="110" cy="45" r="2" fill="#4A90E2" />
      <Circle cx="100" cy="30" r="1.5" fill="#4A90E2" />
      
      {/* Efeito de brilho sutil */}
      <Path
        d={pathData}
        stroke="#FFFFFF"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.3"
      />
    </Svg>
  );
};

const HomeScreen = ({ navigation }) => {
  const navigationHook = useNavigation();
  
  // Obter dimensões da tela para responsividade
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 375; // iPhone SE, etc.
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414; // iPhone 12, etc.
  const isLargeScreen = screenWidth >= 414; // iPhone Plus, etc.

  // Carregamento da fonte e dos ícones
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    ...Feather.font,
    ...AntDesign.font,
  });

  const trilhasInvertidas = [...TRILHAS_MOCADAS];
  const alignmentPattern = [0, 1, 2, 1];

  // Função para lidar com o clique em uma trilha
  const handleTrilhaPress = (trilha) => {
    if (trilha.bloqueada) {
      Alert.alert(
        "Trilha Bloqueada", 
        "Complete a trilha anterior para desbloquear esta trilha!",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Navegar para a tela da trilha (implementar depois)
    Alert.alert(
      "Iniciar Trilha", 
      `Você está prestes a começar: ${trilha.titulo}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Começar", onPress: () => console.log("Iniciando trilha:", trilha.id) }
      ]
    );
  };

  // Criar estilos responsivos
  const styles = createResponsiveStyles(screenWidth, screenHeight);

  // Se as fontes ainda não foram carregadas, exibe um carregador
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0AD58B" />
      </View>
    );
  }

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
            {trilhasInvertidas.map((trilha, index) => {
              const isLast = index === trilhasInvertidas.length - 1;
              const isCompleted = trilha.progresso === 100;
              
              return (
                <View key={trilha.id} style={styles.trilhaWrapper}>
                  <TrilhaItem
                    trilha={trilha}
                    onPress={(trilhaSelecionada) => handleTrilhaPress(trilhaSelecionada)}
                    showConnector={!isLast}
                    isLast={isLast}
                  />
                  
                  {/* Linha conectora curva */}
                  <View style={styles.connectorContainer}>
                    <CurvedConnector
                      isCompleted={isCompleted}
                      isLast={isLast}
                      index={index}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Criar estilos responsivos
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
  trilhaWrapper: {
    alignItems: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  connectorContainer: {
    position: 'absolute',
    top: screenWidth < 375 ? 80 : 90,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 80,
    zIndex: 1,
  },
  });
};

export default HomeScreen;