import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { getTrilhas, getModulosByTrilha, getQuestoesByTrilha } from '../services/contentService';
import { isQuestaoCompleted } from '../services/progressService';

const wp = (p) => {
  const { width } = Dimensions.get('window');
  return (p * width) / 100;
};

const QuestaoCard = ({ questao, isCompleted, onPress, index }) => {
  const colorByDiff = (d) => (d === 'medio' ? '#FFD700' : d === 'dificil' ? '#FF6B6B' : '#58CC02');
  const diffColor = colorByDiff(questao.dificuldade);
  
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          borderColor: diffColor,
          borderWidth: 1,
          shadowColor: diffColor,
        }
      ]} 
      onPress={() => onPress(questao)} 
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Questão {index + 1}</Text>
        <View style={[styles.badge, { backgroundColor: diffColor }]}>
          <Text style={styles.badgeText}>
            {questao.dificuldade === 'medio' ? 'Médio' : questao.dificuldade === 'dificil' ? 'Difícil' : 'Fácil'}
          </Text>
        </View>
      </View>
      <Text style={styles.cardQuestion} numberOfLines={2}>{questao.pergunta}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>{questao.opcoes.length} opções</Text>
        <View style={[styles.statusIcon, { backgroundColor: isCompleted ? '#58CC02' : '#E0E0E0' }]}>
          <MaterialIcons 
            name={isCompleted ? 'check' : 'play-arrow'} 
            size={16} 
            color={isCompleted ? '#FFFFFF' : '#999'} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DesafiosHubScreen = () => {
  const navigation = useNavigation();
  const [trilhas, setTrilhas] = useState([]);
  const [questoes, setQuestoes] = useState([]);
  const [questoesCompletadas, setQuestoesCompletadas] = useState(new Set());
  const [filtroTrilhaId, setFiltroTrilhaId] = useState('all');
  const [modulosQuiz, setModulosQuiz] = useState([]);
  const [filtroModuloId, setFiltroModuloId] = useState('all');
  const [filtroStatus, setFiltroStatus] = useState('all');
  const [filtroDificuldade, setFiltroDificuldade] = useState('all');

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  const carregarTudo = async () => {
    const trilhasData = await getTrilhas();
    setTrilhas(trilhasData);

    const agregadas = [];
    for (const t of trilhasData) {
      try {
        const qs = await getQuestoesByTrilha(t.id);
        agregadas.push(
          ...qs.map((q, idx) => ({
            id: q.id,
            trilhaId: t.id,
            trilhaTitulo: t.titulo,
            moduloId: q.moduloId,
            dificuldade: q.dificuldade || 'facil',
            pergunta: q.enunciado || q.pergunta || '',
            opcoes: (q.opcoes || []).map(o => o.texto || o),
            ordem: q.ordem ?? idx,
          }))
        );
      } catch (_) {}
    }
    agregadas.sort((a,b) => (a.ordem ?? 999) - (b.ordem ?? 999));
    setQuestoes(agregadas);

    // marcar concluídas
    const doneSet = new Set();
    for (const q of agregadas) {
      const ok = await isQuestaoCompleted(q.id, q.trilhaId);
      if (ok) doneSet.add(q.id);
    }
    setQuestoesCompletadas(doneSet);

    // chips de módulos se uma trilha específica estiver selecionada
    if (filtroTrilhaId !== 'all') {
      const mods = await getModulosByTrilha(filtroTrilhaId);
      const ordenados = [...mods].sort((a,b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
      setModulosQuiz(ordenados.filter(m => (m?.tipo || '').toLowerCase() === 'quiz'));
    } else {
      setModulosQuiz([]);
    }
  };

  useEffect(() => { carregarTudo(); }, [filtroTrilhaId]);
  useFocusEffect(useCallback(() => { carregarTudo(); }, [filtroTrilhaId]));

  const questoesFiltradas = useMemo(() => {
    let lista = [...questoes];
    if (filtroTrilhaId !== 'all') lista = lista.filter(q => q.trilhaId === filtroTrilhaId);
    if (filtroModuloId !== 'all') lista = lista.filter(q => q.moduloId === filtroModuloId);
    if (filtroDificuldade !== 'all') lista = lista.filter(q => (q.dificuldade || 'facil') === filtroDificuldade);
    if (filtroStatus === 'todo') lista = lista.filter(q => !questoesCompletadas.has(q.id));
    if (filtroStatus === 'done') lista = lista.filter(q => questoesCompletadas.has(q.id));
    return lista;
  }, [questoes, filtroTrilhaId, filtroModuloId, filtroDificuldade, filtroStatus, questoesCompletadas]);

  const proximaNaoRespondida = useMemo(() => questoesFiltradas.find(q => !questoesCompletadas.has(q.id)), [questoesFiltradas, questoesCompletadas]);

  const handleAbrirQuestao = (q) => {
    navigation.navigate('Questao', { questaoId: q.id, trilhaId: q.trilhaId, moduloId: q.moduloId });
  };

  const handleContinuarProxima = () => {
    if (!proximaNaoRespondida) return;
    handleAbrirQuestao(proximaNaoRespondida);
  };

  if (!fontsLoaded) {
    return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Carregando...</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Desafios</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filtro: Trilhas */}
        <View style={{ marginBottom: 12 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsRow}>
              <TouchableOpacity onPress={() => { setFiltroTrilhaId('all'); setFiltroModuloId('all'); }} style={[styles.chip, filtroTrilhaId==='all' && styles.chipActive]}>
                <Text style={[styles.chipText, filtroTrilhaId==='all' && styles.chipTextActive]}>Todas trilhas</Text>
              </TouchableOpacity>
              {trilhas.map(t => (
                <TouchableOpacity key={t.id} onPress={() => { setFiltroTrilhaId(t.id); setFiltroModuloId('all'); }} style={[styles.chip, filtroTrilhaId===t.id && styles.chipActive]}>
                  <Text style={[styles.chipText, filtroTrilhaId===t.id && styles.chipTextActive]}>{t.titulo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Filtro: Módulos */}
        {modulosQuiz.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipsRow}>
                <TouchableOpacity onPress={() => setFiltroModuloId('all')} style={[styles.chip, filtroModuloId==='all' && styles.chipActive]}>
                  <Text style={[styles.chipText, filtroModuloId==='all' && styles.chipTextActive]}>Todos módulos</Text>
                </TouchableOpacity>
                {modulosQuiz.map(m => (
                  <TouchableOpacity key={m.id} onPress={() => setFiltroModuloId(m.id)} style={[styles.chip, filtroModuloId===m.id && styles.chipActive]}>
                    <Text style={[styles.chipText, filtroModuloId===m.id && styles.chipTextActive]}>{m.titulo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Filtro: Status e Dificuldade */}
        <View style={{ marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipsRow}>
              {[{id:'all',label:'Todas'},{id:'todo',label:'Pendentes'},{id:'done',label:'Concluídas'}].map(opt => (
                <TouchableOpacity key={opt.id} onPress={() => setFiltroStatus(opt.id)} style={[styles.chip, filtroStatus===opt.id && styles.chipActive]}>
                  <Text style={[styles.chipText, filtroStatus===opt.id && styles.chipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
              {[{id:'all',label:'Todas dif.'},{id:'facil',label:'Fácil'},{id:'medio',label:'Médio'},{id:'dificil',label:'Difícil'}].map(opt => (
                <TouchableOpacity key={opt.id} onPress={() => setFiltroDificuldade(opt.id)} style={[styles.chip, filtroDificuldade===opt.id && styles.chipActive]}>
                  <Text style={[styles.chipText, filtroDificuldade===opt.id && styles.chipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* CTA continuar */}
        {proximaNaoRespondida && (
          <View style={{ marginTop: 12, marginBottom: 16 }}>
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
                fontWeight: '700',
                fontFamily: 'Outfit-Bold',
                color: '#FFFFFF',
              }}>
                Continuar próxima
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Título da seção */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 20,
            fontFamily: 'Outfit-Bold',
            color: '#1A1A1A',
          }}>
            Questões ({questoesFiltradas.length})
          </Text>
        </View>

        {/* Lista */}
        <View style={styles.grid}>
          {questoesFiltradas.map((q, i) => (
            <View key={q.id} style={{ width: '48%' }}>
              <QuestaoCard questao={q} index={i} isCompleted={questoesCompletadas.has(q.id)} onPress={handleAbrirQuestao} />
            </View>
          ))}
          {questoesFiltradas.length === 0 && (
            <View style={{ alignItems:'center', paddingVertical: 40, width: '100%' }}>
              <MaterialIcons name="quiz" size={48} color="#E0E0E0" />
              <Text style={{ fontFamily:'Outfit-Regular', color:'#999', marginTop: 8, fontSize: 14 }}>
                Nenhuma questão encontrada.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#F7F9FC' },
  header: { 
    backgroundColor:'#58CC02', 
    paddingHorizontal:20, 
    paddingVertical:18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: { color:'#FFF', fontFamily:'Outfit-Bold', fontSize:20 },
  content: { flex:1, paddingHorizontal:16, paddingTop:20 },
  chipsRow: { flexDirection:'row', gap:8, paddingVertical: 4 },
  chip: { 
    paddingHorizontal:14, 
    paddingVertical:8, 
    borderRadius:20, 
    backgroundColor:'#F0F0F0',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: { 
    backgroundColor:'#58CC02',
    borderColor: '#58CC02',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: { 
    fontFamily:'Outfit-Bold', 
    color:'#666',
    fontSize: 13,
  },
  chipTextActive: { 
    color:'#FFF',
    fontSize: 13,
  },
  grid: { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', rowGap:12 },
  card: { 
    backgroundColor:'#FFF', 
    borderRadius:16, 
    padding:16, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  cardTitle: { fontFamily:'Outfit-Bold', color:'#1A1A1A', fontSize:14, flex:1, marginRight:8 },
  badge: { paddingHorizontal:10, paddingVertical:5, borderRadius:16, minWidth: 60, alignItems: 'center' },
  badgeText: { color:'#FFF', fontFamily:'Outfit-Bold', fontSize:11 },
  cardQuestion: { fontFamily:'Outfit-Regular', color:'#333', fontSize:13, lineHeight:18, marginBottom:12, minHeight: 36 },
  cardFooter: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  footerText: { color:'#999', fontFamily:'Outfit-Regular', fontSize:11 },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DesafiosHubScreen;


