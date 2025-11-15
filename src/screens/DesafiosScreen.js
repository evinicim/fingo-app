import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
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
  const palette = {
    facil: {
      primary: '#34D399',
      badge: 'rgba(52, 211, 153, 0.2)',
      border: 'rgba(52, 211, 153, 0.5)'
      primary: '#18AD77',
      badge: 'rgba(24, 173, 119, 0.2)',
      border: 'rgba(24, 173, 119, 0.5)'
    },
    medio: {
      primary: '#FBBF24',
      badge: 'rgba(251, 191, 36, 0.2)',
      border: 'rgba(251, 191, 36, 0.45)'
    },
    dificil: {
      primary: '#F472B6',
      badge: 'rgba(244, 114, 182, 0.2)',
      border: 'rgba(244, 114, 182, 0.45)'
    }
  }[questao.dificuldade] || {
    primary: '#34D399',
    badge: 'rgba(52, 211, 153, 0.2)',
    border: 'rgba(52, 211, 153, 0.5)'
    primary: '#18AD77',
    badge: 'rgba(24, 173, 119, 0.2)',
    border: 'rgba(24, 173, 119, 0.5)'
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
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: palette.border,
    },
    questaoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    questaoTitulo: {
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
      color: '#F8FAFC',
      flex: 1,
    },
    dificuldadeBadge: {
      backgroundColor: palette.badge,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.border,
    },
    dificuldadeText: {
      fontSize: 12,
      fontFamily: 'Outfit-Bold',
      color: palette.primary,
    },
    questaoPergunta: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#CBD5F5',
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
      fontFamily: 'Outfit-Bold',
      color: '#E2E8F0',
      backgroundColor: 'rgba(148, 163, 184, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
      backgroundColor: isCompleted ? 'rgba(24, 173, 119, 0.2)' : 'rgba(148, 163, 184, 0.2)',
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: isCompleted ? 'rgba(16, 185, 129, 0.5)' : 'rgba(148, 163, 184, 0.4)'
      borderColor: isCompleted ? 'rgba(24, 173, 119, 0.5)' : 'rgba(148, 163, 184, 0.4)'
    },
    statusText: {
      fontSize: 12,
      fontFamily: 'Outfit-Bold',
      color: isCompleted ? '#6EE7B7' : '#CBD5F5',
      color: isCompleted ? '#2BC896' : '#CBD5F5',
      marginLeft: 4,
    }
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
          <MaterialIcons
            name={isCompleted ? "check-circle" : "play-arrow"}
            size={14}
            color={isCompleted ? '#6EE7B7' : '#E2E8F0'}
            color={isCompleted ? '#2BC896' : '#E2E8F0'}
          />
          <Text style={styles.statusText}>{isCompleted ? 'Concluída' : 'Estudar'}</Text>
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
      Alert.alert(
        'Parabéns! 🎉', 
        'Você concluiu todas as questões desta trilha!',
        [
          {
            text: 'Voltar ao Início',
            onPress: () => navigation.navigate('Main', { screen: 'Home' })
          }
        ]
      );
      return;
    }
    handleQuestaoPress(proxima);
  };

  // Lista final
  const questoesFiltradas = useMemo(() => questoes, [questoes]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#050A1B',
    },
    header: {
      backgroundColor: '#0F172A',
      paddingHorizontal: 20,
      paddingVertical: 18,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      borderBottomWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.3)'
      borderColor: 'rgba(24, 173, 119, 0.3)'
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
      color: '#F8FAFC',
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#94A3B8',
      marginTop: 4,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    filtersRow: {
      marginBottom: 12,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#F0F0F0',
      marginRight: 8,
      marginBottom: 8,
    },
    chipActive: { backgroundColor: '#18AD77' },
    chipText: { fontFamily: 'Outfit-Bold', color: '#1A1A1A' },
    chipTextActive: { color: '#FFFFFF' },
    moduloInfo: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    moduloTitle: {
      fontSize: 20,
      fontFamily: 'Outfit-Bold',
      color: '#F8FAFC',
      marginBottom: 8,
    },
    moduloDescription: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#CBD5F5',
      lineHeight: 20,
    },
    questoesSection: {
      marginBottom: 20,
    },
    questoesTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#E2E8F0',
      marginBottom: 16,
    },
    questoesList: {
      flex: 1,
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
      color: '#94A3B8',
      textAlign: 'center',
    },
    blockedState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(248, 113, 113, 0.4)',
    },
    blockedTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#F87171',
      marginTop: 16,
      marginBottom: 8,
    },
    blockedText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#CBD5F5',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    historiaButton: {
      backgroundColor: '#22D3EE',
      backgroundColor: '#18AD77',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    historiaButtonText: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#0F172A',
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
        <View style={{ marginBottom: 12 }}>
          <TouchableOpacity style={[styles.historiaButton, { backgroundColor: '#4A90E2' }]} onPress={handleContinuarProxima}>
            <Text style={styles.historiaButtonText}>Continuar próxima</Text>
          </TouchableOpacity>
        </View>

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