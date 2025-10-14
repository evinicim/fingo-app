import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: colorByDiff(questao.dificuldade) }]} onPress={() => onPress(questao)} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{questao.trilhaTitulo} · Q{index + 1}</Text>
        <View style={[styles.badge, { backgroundColor: colorByDiff(questao.dificuldade) }]}>
          <Text style={styles.badgeText}>{questao.dificuldade === 'medio' ? 'Médio' : questao.dificuldade === 'dificil' ? 'Difícil' : 'Fácil'}</Text>
        </View>
      </View>
      <Text style={styles.cardQuestion} numberOfLines={2}>{questao.pergunta}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>{questao.opcoes.length} opções</Text>
        <MaterialIcons name={isCompleted ? 'check-circle' : 'play-circle-outline'} size={18} color={isCompleted ? '#58CC02' : '#999'} />
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
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

        {/* Filtro: Módulos e Status/Dif */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
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

        {/* CTA continuar */}
        <View style={{ marginTop: 8, marginBottom: 12 }}>
          <TouchableOpacity style={[styles.ctaButton]} onPress={handleContinuarProxima}>
            <Text style={styles.ctaText}>Continuar próxima</Text>
          </TouchableOpacity>
        </View>

        {/* Lista */}
        <View style={styles.grid}>
          {questoesFiltradas.map((q, i) => (
            <View key={q.id} style={{ width: '48%' }}>
              <QuestaoCard questao={q} index={i} isCompleted={questoesCompletadas.has(q.id)} onPress={handleAbrirQuestao} />
            </View>
          ))}
          {questoesFiltradas.length === 0 && (
            <View style={{ alignItems:'center', paddingVertical: 40 }}>
              <MaterialIcons name="quiz" size={48} color="#E0E0E0" />
              <Text style={{ fontFamily:'Outfit-Regular', color:'#999', marginTop: 8 }}>Nenhuma questão encontrada.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#F7F9FC' },
  header: { backgroundColor:'#58CC02', paddingHorizontal:20, paddingVertical:16 },
  headerTitle: { color:'#FFF', fontFamily:'Outfit-Bold', fontSize:18 },
  content: { flex:1, paddingHorizontal:16, paddingTop:16 },
  chipsRow: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  chip: { paddingHorizontal:12, paddingVertical:6, borderRadius:16, backgroundColor:'#F0F0F0' },
  chipActive: { backgroundColor:'#58CC02' },
  chipText: { fontFamily:'Outfit-Bold', color:'#1A1A1A' },
  chipTextActive: { color:'#FFF' },
  ctaButton: { backgroundColor:'#4A90E2', paddingVertical:12, borderRadius:8, alignItems:'center' },
  ctaText: { color:'#FFF', fontFamily:'Outfit-Bold' },
  grid: { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', rowGap:10 },
  card: { backgroundColor:'#FFF', borderRadius:12, padding:12, borderLeftWidth:4, elevation:3 },
  cardHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  cardTitle: { fontFamily:'Outfit-Bold', color:'#1A1A1A', fontSize:12, flex:1, marginRight:8 },
  badge: { paddingHorizontal:8, paddingVertical:4, borderRadius:12 },
  badgeText: { color:'#FFF', fontFamily:'Outfit-Bold', fontSize:10 },
  cardQuestion: { fontFamily:'Outfit-Regular', color:'#333', fontSize:14, lineHeight:20, marginBottom:8 },
  cardFooter: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  footerText: { color:'#999', fontFamily:'Outfit-Regular', fontSize:12 },
});

export default DesafiosHubScreen;


