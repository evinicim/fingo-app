import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { getModulosByTrilha, getQuestoesByTrilha } from '../services/contentService';
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

  const diffColor = getDificuldadeColor(questao.dificuldade);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: diffColor,
        shadowColor: diffColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}
      onPress={() => onPress(questao)}
      activeOpacity={0.8}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <Text style={{
          fontFamily: 'Outfit-Bold',
          color: '#1A1A1A',
          fontSize: 14,
          flex: 1,
          marginRight: 8,
        }}>
          Questão {index + 1}
        </Text>
        <View style={{
          backgroundColor: diffColor,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 16,
          minWidth: 60,
          alignItems: 'center',
        }}>
          <Text style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-Bold',
            fontSize: 11,
          }}>
            {getDificuldadeText(questao.dificuldade)}
          </Text>
        </View>
      </View>
      
      <Text style={{
        fontFamily: 'Outfit-Regular',
        color: '#333',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 12,
        minHeight: 36,
      }} numberOfLines={2}>
        {questao.pergunta}
      </Text>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{
          color: '#999',
          fontFamily: 'Outfit-Regular',
          fontSize: 11,
        }}>
          {questao.opcoes.length} opções
        </Text>
        <View style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: isCompleted ? '#58CC02' : '#E0E0E0',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <MaterialIcons 
            name={isCompleted ? "check" : "play-arrow"} 
            size={16} 
            color={isCompleted ? "#FFFFFF" : "#999"} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DesafiosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { trilhaId, moduloId } = route.params || { trilhaId: null, moduloId: null };
  
  const [questoes, setQuestoes] = useState([]);
  const [moduloInfo, setModuloInfo] = useState(null);
  const [moduloSelecionadoId, setModuloSelecionadoId] = useState(null);
  const [questoesCompletadas, setQuestoesCompletadas] = useState(new Set());
  const [historiaConcluida, setHistoriaConcluida] = useState(false);
  const [modulosQuiz, setModulosQuiz] = useState([]);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  const loadDesafiosState = async () => {
    if (!trilhaId) return;
    const modulos = await getModulosByTrilha(trilhaId);
    const ordenados = [...modulos].sort((a,b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    setModulosQuiz(ordenados.filter(m => (m?.tipo || '').toLowerCase() === 'quiz'));

    const moduloSel = moduloId ? ordenados.find(m => m.id === moduloId) : (ordenados.find(m => (m?.tipo || '').toLowerCase() === 'quiz') || ordenados[0]);
    if (moduloSel) {
      setModuloSelecionadoId(moduloSel.id);
      setModuloInfo({ titulo: moduloSel.titulo, trilhaTitulo: '', descricao: moduloSel.descricao });
    }

    // Carregar questões apenas desta trilha
    const qs = await getQuestoesByTrilha(trilhaId);
    const normalizadas = qs.map(q => ({
      id: q.id,
      moduloId: q.moduloId,
      dificuldade: q.dificuldade || 'facil',
      pergunta: q.enunciado || q.pergunta || '',
      opcoes: (q.opcoes || []).map(o => o.texto || o),
      ordem: q.ordem ?? 999,
    })).sort((a,b) => (a.ordem ?? 999) - (b.ordem ?? 999));
    setQuestoes(normalizadas);

    // Marcar concluídas desta trilha
    const doneSet = new Set();
    for (const q of normalizadas) {
      const done = await isQuestaoCompleted(q.id, trilhaId);
      if (done) doneSet.add(q.id);
    }
    setQuestoesCompletadas(doneSet);

    const h = await isHistoriaCompleted(trilhaId);
    setHistoriaConcluida(h);
  };

  useEffect(() => {
    loadDesafiosState();
  }, [trilhaId, moduloId]);

  // Recarregar estado quando a tela ganha foco (ex: volta da QuestaoScreen)
  useFocusEffect(useCallback(() => { loadDesafiosState(); }, [trilhaId, moduloId]));

  const handleQuestaoPress = (questao) => {
    navigation.navigate('Questao', {
      questaoId: questao.id,
      trilhaId,
      // usar o módulo correto da própria questão
      moduloId: questao.moduloId || moduloSelecionadoId
    });
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  // Continuar para a próxima questão não respondida (sequencial)
  const handleContinuarProxima = () => {
    const proxima = questoes.find(q => !questoesCompletadas.has(q.id));
    if (!proxima) {
      Alert.alert('Tudo certo!', 'Você concluiu todas as questões desta trilha.');
      return;
    }
    handleQuestaoPress(proxima);
  };

  // Lista final
  const questoesFiltradas = useMemo(() => questoes, [questoes]);

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
    filtersRow: {
      marginBottom: 12,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#F0F0F0',
    },
    chipActive: { backgroundColor: '#58CC02' },
    chipText: { fontFamily: 'Outfit-Bold', color: '#1A1A1A' },
    chipTextActive: { color: '#FFFFFF' },
    moduloInfo: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    moduloTitle: {
      fontSize: 20,
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
      fontSize: 20,
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 16,
    },
    questoesList: {
      flex: 1,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 12,
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
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
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

        {/* Sem filtros nesta visão */}

        {/* Ação rápida para seguir na próxima */}
        {historiaConcluida && questoesFiltradas.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <TouchableOpacity 
              style={{
                backgroundColor: '#4A90E2',
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: 'center',
                shadowColor: '#4A90E2',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }} 
              onPress={handleContinuarProxima}
            >
              <Text style={{
                fontSize: 16,
                fontFamily: 'Outfit-Bold',
                color: '#FFFFFF',
              }}>
                Continuar próxima
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Questões */}
        <View style={styles.questoesSection}>
          <Text style={styles.questoesTitle}>
            Questões ({questoesFiltradas.length})
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
          ) : questoesFiltradas.length > 0 ? (
            <View style={[styles.questoesList, styles.gridContainer]}>
              {questoesFiltradas.map((questao, index) => (
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