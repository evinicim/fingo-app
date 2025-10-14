import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { getModulosByTrilha, getQuestoesByModulo } from '../services/contentService';
import { isHistoriaCompleted, isQuestaoCompleted } from '../services/progressService';

// Funções de responsividade simples
const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

// Componente para item de questão
const QuestaoItem = ({ questao, onPress, isCompleted = false, index }) => {
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
    questaoContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: getDificuldadeColor(questao.dificuldade),
    },
    questaoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    questaoTitulo: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      flex: 1,
    },
    dificuldadeBadge: {
      backgroundColor: getDificuldadeColor(questao.dificuldade),
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    dificuldadeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: 'Outfit-Bold',
    },
    questaoPergunta: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      lineHeight: 20,
      marginBottom: 12,
    },
    questaoFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    opcoesCount: {
      fontSize: 12,
      fontFamily: 'Outfit-Regular',
      color: '#999999',
    },
    statusIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: isCompleted ? '#58CC02' : '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <TouchableOpacity
      style={styles.questaoContainer}
      onPress={() => onPress(questao)}
      activeOpacity={0.7}
    >
      <View style={styles.questaoHeader}>
        <Text style={styles.questaoTitulo}>Questão {index + 1}</Text>
        <View style={styles.dificuldadeBadge}>
          <Text style={styles.dificuldadeText}>{getDificuldadeText(questao.dificuldade)}</Text>
        </View>
      </View>
      
      <Text style={styles.questaoPergunta} numberOfLines={3}>
        {questao.pergunta}
      </Text>
      
      <View style={styles.questaoFooter}>
        <Text style={styles.opcoesCount}>
          {questao.opcoes.length} opções
        </Text>
        <View style={styles.statusIcon}>
          <AntDesign 
            name={isCompleted ? "check" : "play"} 
            size={12} 
            color={isCompleted ? "#FFFFFF" : "#999999"} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DesafiosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { trilhaId, moduloId } = route.params || { trilhaId: 'trilha_01', moduloId: null };
  
  const [questoes, setQuestoes] = useState([]);
  const [moduloInfo, setModuloInfo] = useState(null);
  const [questoesCompletadas, setQuestoesCompletadas] = useState(new Set());
  const [historiaConcluida, setHistoriaConcluida] = useState(false);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    const loadDesafiosState = async () => {
      if (trilhaId) {
        // Se não vier moduloId, pega o primeiro módulo da trilha
        const modulos = await getModulosByTrilha(trilhaId);
        const moduloSelecionado = moduloId ? modulos.find(m => m.id === moduloId) : modulos[0];
        if (moduloSelecionado) {
          setModuloInfo({
            titulo: moduloSelecionado.titulo,
            trilhaTitulo: '',
            descricao: moduloSelecionado.descricao
          });
          const questoesData = await getQuestoesByModulo(moduloSelecionado.id);
          // normalizar para o componente
          setQuestoes(questoesData.map(q => ({
            id: q.id,
            dificuldade: q.dificuldade || 'facil',
            pergunta: q.enunciado,
            opcoes: q.opcoes?.map(o => o.texto) || []
          })));
        }
        
        // Verificar se a história foi concluída
        const historiaCompleta = await isHistoriaCompleted(trilhaId);
        setHistoriaConcluida(historiaCompleta);
        
        // Verificar quais questões foram completadas
        const questoesCompletadasSet = new Set();
        for (const questao of questoes) {
          const completada = await isQuestaoCompleted(questao.id);
          if (completada) {
            questoesCompletadasSet.add(questao.id);
          }
        }
        setQuestoesCompletadas(questoesCompletadasSet);
      }
    };
    
    loadDesafiosState();
  }, [trilhaId, moduloId]);

  // Recarregar estado quando a tela ganha foco (ex: volta da QuestaoScreen)
  useFocusEffect(
    useCallback(() => {
      const reloadState = async () => {
        if (trilhaId && moduloId) {
          // Verificar se a história foi concluída
          const historiaCompleta = await isHistoriaCompleted(trilhaId);
          setHistoriaConcluida(historiaCompleta);
          
          // Verificar quais questões foram completadas
          const questoesCompletadasSet = new Set();
          for (const questao of questoes) {
            const completada = await isQuestaoCompleted(questao.id);
            if (completada) {
              questoesCompletadasSet.add(questao.id);
            }
          }
          setQuestoesCompletadas(questoesCompletadasSet);
        }
      };
      
      reloadState();
    }, [trilhaId, moduloId, questoes])
  );

  const handleQuestaoPress = (questao) => {
    navigation.navigate('Questao', {
      questaoId: questao.id,
      trilhaId,
      moduloId
    });
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
    moduloInfo: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    moduloTitle: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 8,
    },
    moduloDescription: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      lineHeight: 20,
    },
    questoesSection: {
      marginBottom: 20,
    },
    questoesTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 16,
    },
    questoesList: {
      flex: 1,
      gap: 10,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Outfit-Regular',
      color: '#999999',
      textAlign: 'center',
    },
    blockedState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      backgroundColor: '#FFF5F5',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#FFE0E0',
      borderStyle: 'dashed',
    },
    blockedTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#FF6B6B',
      marginTop: 16,
      marginBottom: 8,
    },
    blockedText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    historiaButton: {
      backgroundColor: '#58CC02',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    historiaButtonText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#FFFFFF',
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
          <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Desafios</Text>
          <Text style={styles.headerSubtitle}>
            {moduloInfo ? moduloInfo.trilhaTitulo : 'Carregando...'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações do Módulo */}
        {moduloInfo && (
          <View style={styles.moduloInfo}>
            <Text style={styles.moduloTitle}>{moduloInfo.titulo}</Text>
            <Text style={styles.moduloDescription}>{moduloInfo.descricao}</Text>
          </View>
        )}

        {/* Lista de Questões */}
        <View style={styles.questoesSection}>
          <Text style={styles.questoesTitle}>
            Questões ({questoes.length})
          </Text>
          
          {!historiaConcluida ? (
            <View style={styles.blockedState}>
              <MaterialIcons name="lock" size={48} color="#FF6B6B" />
              <Text style={styles.blockedTitle}>
                Questões Bloqueadas
              </Text>
              <Text style={styles.blockedText}>
                Complete a história desta trilha para desbloquear as questões!
              </Text>
              <TouchableOpacity
                style={styles.historiaButton}
                onPress={() => navigation.navigate('Historia', { trilhaId })}
              >
                <Text style={styles.historiaButtonText}>
                  Ler História
                </Text>
              </TouchableOpacity>
            </View>
          ) : questoes.length > 0 ? (
            <View style={[styles.questoesList, styles.gridContainer]}>
              {questoes.map((questao, index) => (
                <View key={questao.id} style={{ width: '48%' }}>
                  <QuestaoItem
                    questao={questao}
                    index={index}
                    onPress={handleQuestaoPress}
                    isCompleted={questoesCompletadas.has(questao.id)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="quiz" size={48} color="#E0E0E0" />
              <Text style={styles.emptyText}>
                Nenhuma questão disponível para este módulo.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DesafiosScreen;