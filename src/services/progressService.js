// Serviço para gerenciar o progresso do usuário
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { getTrilhas, getModulosByTrilha } from './contentService';
import { syncToFirebase, syncFromFirebase, checkSyncConflicts } from './syncService';

const getProgressKey = () => {
  const uid = auth.currentUser?.uid;
  return uid ? `user_progress_${uid}` : 'user_progress';
};

// Estrutura de progresso do usuário
const defaultProgress = {
  historiasConcluidas: [],
  questoesCompletadas: [],
  trilhasProgresso: {},
  ultimaAtualizacao: new Date().toISOString()
};

// Função para carregar progresso do usuário
export const loadUserProgress = async () => {
  try {
    // Verificar se há conflitos de sincronização
    const conflicts = await checkSyncConflicts();
    if (conflicts?.conflict) {
      console.log('⚠️ Conflito de sincronização detectado, usando versão mais recente');
      const newerData = conflicts[conflicts.newer];
      await AsyncStorage.setItem(getProgressKey(), JSON.stringify(newerData));
      return newerData;
    }

    // Tentar buscar do Firebase primeiro (fonte da verdade)
    const firebaseProgress = await syncFromFirebase();
    if (firebaseProgress) {
      return firebaseProgress;
    }

    // Fallback para AsyncStorage
    const progressData = await AsyncStorage.getItem(getProgressKey());
    if (progressData) {
      const parsed = JSON.parse(progressData);
      // Migração: ids antigos de questões (q_1_1_1) não são compatíveis
      const hasLegacyIds = Array.isArray(parsed?.questoesCompletadas) && parsed.questoesCompletadas.some(q => /^q_\d/.test(q?.id));
      if (hasLegacyIds) {
        const migrated = { ...defaultProgress, historiasConcluidas: parsed.historiasConcluidas || [] };
        await saveUserProgress(migrated);
        return migrated;
      }
      return parsed;
    }
    return defaultProgress;
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return defaultProgress;
  }
};

// Função para salvar progresso do usuário
export const saveUserProgress = async (progress) => {
  try {
    const progressToSave = {
      ...progress,
      ultimaAtualizacao: new Date().toISOString()
    };
    
    // Salvar localmente primeiro (para performance)
    await AsyncStorage.setItem(getProgressKey(), JSON.stringify(progressToSave));
    
    // Sincronizar com Firebase (fonte da verdade)
    const syncSuccess = await syncToFirebase(progressToSave);
    if (!syncSuccess) {
      console.warn('⚠️ Falha na sincronização com Firebase, dados salvos localmente');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return false;
  }
};

// Função para marcar história como concluída
export const markHistoriaAsCompleted = async (trilhaId) => {
  try {
    const progress = await loadUserProgress();
    
    if (!progress.historiasConcluidas.includes(trilhaId)) {
      progress.historiasConcluidas.push(trilhaId);
      await saveUserProgress(progress);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao marcar história como concluída:', error);
    return false;
  }
};

// Função para verificar se história foi concluída
export const isHistoriaCompleted = async (trilhaId) => {
  try {
    const progress = await loadUserProgress();
    return progress.historiasConcluidas.includes(trilhaId);
  } catch (error) {
    console.error('Erro ao verificar conclusão da história:', error);
    return false;
  }
};

// Função para marcar questão como completada
export const markQuestaoAsCompleted = async (questaoId, trilhaId, respostaSelecionada = null, correta = false, pontuacao = 0) => {
  try {
    const progress = await loadUserProgress();
    
    const questaoExistente = progress.questoesCompletadas.find(q => q.id === questaoId);
    if (questaoExistente) {
      questaoExistente.pontuacao = Math.max(questaoExistente.pontuacao, pontuacao);
      questaoExistente.dataConclusao = new Date().toISOString();
      questaoExistente.trilhaId = trilhaId || questaoExistente.trilhaId;
      questaoExistente.correta = typeof correta === 'boolean' ? correta : questaoExistente.correta;
      questaoExistente.respostaSelecionada = respostaSelecionada;
    } else {
      progress.questoesCompletadas.push({
        id: questaoId,
        trilhaId,
        correta,
        respostaSelecionada,
        pontuacao,
        dataConclusao: new Date().toISOString()
      });
    }
    
    await saveUserProgress(progress);

    // Persistir resultado detalhado no Firestore
    const userId = auth.currentUser?.uid;
    if (userId && trilhaId) {
      const questaoRef = doc(db, 'users', userId, 'progresso', trilhaId, 'questoes', questaoId);
      await setDoc(questaoRef, {
        questaoId,
        trilhaId,
        correta,
        respostaSelecionada,
        pontuacao,
        dataConclusao: new Date().toISOString()
      }, { merge: true });

      // Atualiza documento agregador por trilha com lista de IDs concluídos
      const idsDaTrilha = progress.questoesCompletadas.filter(q => q.trilhaId === trilhaId).map(q => q.id);
      const progRef = doc(db, 'users', userId, 'progresso', trilhaId);
      await setDoc(progRef, { questoesCompletadas: idsDaTrilha }, { merge: true });
    }
    return true;
  } catch (error) {
    console.error('Erro ao marcar questão como completada:', error);
    return false;
  }
};

// Função para verificar se questão foi completada
export const isQuestaoCompleted = async (questaoId, trilhaId) => {
  try {
    const progress = await loadUserProgress();
    if (progress.questoesCompletadas.some(q => q.id === questaoId)) {
      return true;
    }
    // Verificar no Firestore
    const userId = auth.currentUser?.uid;
    if (userId && trilhaId) {
      const qRef = doc(db, 'users', userId, 'progresso', trilhaId, 'questoes', questaoId);
      const snap = await getDoc(qRef);
      if (snap.exists()) return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao verificar conclusão da questão:', error);
    return false;
  }
};

// Função para atualizar progresso da trilha
export const updateTrilhaProgress = async (trilhaId, progresso) => {
  try {
    const progress = await loadUserProgress();
    progress.trilhasProgresso[trilhaId] = progresso;
    await saveUserProgress(progress);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar progresso da trilha:', error);
    return false;
  }
};

// Função para calcular progresso da trilha (história + questões)
export const calculateTrilhaProgress = async (trilhaId) => {
  try {
    const progress = await loadUserProgress();
    // Buscar questões da trilha; se não retornar nada (dados antigos), faz fallback por módulos
    let questoesDocs = [];
    try {
      const qsSnap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', trilhaId)));
      questoesDocs = qsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (_) {}
    if (!Array.isArray(questoesDocs) || questoesDocs.length === 0) {
      // Fallback: agrega questões por cada módulo da trilha
      const modulos = await getModulosByTrilha(trilhaId);
      const agregadas = [];
      for (const m of modulos) {
        try {
          const snap = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', m.id)));
          snap.docs.forEach(d => agregadas.push({ id: d.id, ...d.data() }));
        } catch (_) {}
      }
      questoesDocs = agregadas;
    }
    const totalQuestoes = questoesDocs.length;
    const totalItens = 1 + totalQuestoes; // 1 história + questões
    let itensCompletados = 0;
    
    // Verificar se história foi concluída (50% do progresso)
    if (progress.historiasConcluidas.includes(trilhaId)) {
      itensCompletados += 1;
    }
    
    // Verificar questões completadas (50% do progresso) usando IDs reais da trilha + Firestore
    const questoesIdsCompletas = new Set(progress.questoesCompletadas
      .filter(q => q.trilhaId === trilhaId)
      .map(q => q.id));

    const userId = auth.currentUser?.uid;
    if (userId) {
      const concluSnap = await getDocs(collection(db, 'users', userId, 'progresso', trilhaId, 'questoes'));
      concluSnap.docs.forEach(d => questoesIdsCompletas.add(d.id));
    }
    const questoesCompletadas = questoesDocs.filter(q => questoesIdsCompletas.has(q.id)).length;
    
    itensCompletados += questoesCompletadas;
    
    // Calcular porcentagem
    const porcentagem = Math.round((itensCompletados / totalItens) * 100);
    
    // Salvar progresso calculado
    await updateTrilhaProgress(trilhaId, porcentagem);
    // Persistir no Firestore por trilha
    const userId2 = auth.currentUser?.uid;
    if (userId2) {
      const progRef = doc(db, 'users', userId2, 'progresso', trilhaId);
      await setDoc(progRef, {
        progresso: porcentagem,
        historiasConcluidas: progress.historiasConcluidas.includes(trilhaId),
        // Salva apenas IDs; detalhes ficam na subcoleção 'questoes'
        questoesCompletadas: Array.from(questoesIdsCompletas),
        dataAtualizacao: new Date().toISOString(),
      }, { merge: true });
    }
    
    return porcentagem;
  } catch (error) {
    console.error('Erro ao calcular progresso da trilha:', error);
    return 0;
  }
};

// Função para obter progresso da trilha
export const getTrilhaProgress = async (trilhaId) => {
  try {
    const progress = await loadUserProgress();
    return progress.trilhasProgresso[trilhaId] || 0;
  } catch (error) {
    console.error('Erro ao obter progresso da trilha:', error);
    return 0;
  }
};

// Função para verificar se uma trilha está desbloqueada
export const isTrilhaUnlocked = async (trilhaId) => {
  try {
    // A primeira trilha sempre está desbloqueada
    if (trilhaId === 'trilha_01') return true;

    // Para outras trilhas: desbloqueia se a trilha anterior estiver 100% concluída
    const trilhaAnterior = getTrilhaAnterior(trilhaId);
    if (!trilhaAnterior) return false;

    const progressoAnterior = await calculateTrilhaProgress(trilhaAnterior);
    return progressoAnterior >= 100;
  } catch (error) {
    console.error('Erro ao verificar desbloqueio da trilha:', error);
    return false;
  }
};

// Função para obter a trilha anterior
const getTrilhaAnterior = (trilhaId) => {
  const trilhas = ['trilha_01', 'trilha_02', 'trilha_03', 'trilha_04', 'trilha_05'];
  const index = trilhas.indexOf(trilhaId);
  return index > 0 ? trilhas[index - 1] : null;
};

// Função para verificar se uma trilha está completamente concluída (história + todas as questões)
export const isTrilhaCompletamenteConcluida = async (trilhaId) => {
  try {
    const progress = await loadUserProgress();
    
    // Verificar se a história foi concluída
    const historiaConcluida = progress.historiasConcluidas.includes(trilhaId);
    if (!historiaConcluida) {
      return false;
    }
    
    // Buscar todas as questões da trilha no Firestore
    const qsSnap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', trilhaId)));
    const todasQuestoes = qsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Verificar se todas as questões foram completadas
    for (const questao of todasQuestoes) {
      const questaoCompleta = progress.questoesCompletadas.some(q => q.id === questao.id);
      if (!questaoCompleta) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar conclusão completa da trilha:', error);
    return false;
  }
};

// Função para obter todas as trilhas com status de desbloqueio
export const getTrilhasWithUnlockStatus = async () => {
  try {
    const progress = await loadUserProgress();
    const trilhas = await getTrilhas();
    const trilhasComStatus = await Promise.all(
      trilhas.map(async (t) => {
        const trilhaId = t.id;
        const desbloqueada = await isTrilhaUnlocked(trilhaId);
        const historiaConcluida = progress.historiasConcluidas.includes(trilhaId);
        const progressoCalculado = await calculateTrilhaProgress(trilhaId);
        return { id: trilhaId, desbloqueada, historiaConcluida, progresso: progressoCalculado };
      })
    );
    return trilhasComStatus;
  } catch (error) {
    console.error('Erro ao obter status das trilhas:', error);
    return [];
  }
};

// Estatísticas agregadas do usuário (dinâmicas)
export const getUserStats = async () => {
  try {
    const uid = auth.currentUser?.uid;
    const trilhas = await getTrilhas();
    const totalTrilhas = trilhas.length;

    // Concluir trilhas e somar progresso/xp
    let trilhasConcluidas = 0;
    let questoesRespondidas = 0;
    let xpQuestoes = 0;

    for (const t of trilhas) {
      const prog = await calculateTrilhaProgress(t.id);
      if (prog >= 100) trilhasConcluidas += 1;

      if (uid) {
        const qsSnap = await getDocs(collection(db, 'users', uid, 'progresso', t.id, 'questoes'));
        questoesRespondidas += qsSnap.size;
        qsSnap.docs.forEach((d) => { xpQuestoes += Number(d.data()?.pontuacao || 0); });
      }
    }

    // XP por histórias concluídas (50 cada) usando cache local
    const progress = await loadUserProgress();
    const xpHistorias = (progress?.historiasConcluidas?.length || 0) * 50;
    const xp = xpQuestoes + xpHistorias;
    const level = Math.max(1, Math.floor(xp / 100) + 1);

    return { totalTrilhas, trilhasConcluidas, questoesRespondidas, xp, level };
  } catch (error) {
    console.error('Erro ao calcular estatísticas do usuário:', error);
    return { totalTrilhas: 0, trilhasConcluidas: 0, questoesRespondidas: 0, xp: 0, level: 1 };
  }
};

// Função para debug - verificar status de todas as trilhas
export const debugTrilhasStatus = async () => {
  try {
    const progress = await loadUserProgress();
    const trilhas = ['trilha_01', 'trilha_02', 'trilha_03', 'trilha_04', 'trilha_05'];
    
    console.log('=== DEBUG TRILHAS STATUS ===');
    console.log('Progresso atual:', progress);
    
    for (const trilhaId of trilhas) {
      const desbloqueada = await isTrilhaUnlocked(trilhaId);
      const historiaConcluida = progress.historiasConcluidas.includes(trilhaId);
      const progresso = progress.trilhasProgresso[trilhaId] || 0;
      
      console.log(`${trilhaId}:`);
      console.log(`  - Desbloqueada: ${desbloqueada}`);
      console.log(`  - História concluída: ${historiaConcluida}`);
      console.log(`  - Progresso: ${progresso}%`);
      
      if (trilhaId !== 'trilha_01') {
        const trilhaAnterior = getTrilhaAnterior(trilhaId);
        const historiaAnterior = progress.historiasConcluidas.includes(trilhaAnterior);
        console.log(`  - Trilha anterior (${trilhaAnterior}): história concluída = ${historiaAnterior}`);
      }
    }
    
    console.log('=== FIM DEBUG ===');
  } catch (error) {
    console.error('Erro no debug:', error);
  }
};

// Função para resetar progresso (para testes)
export const resetProgress = async () => {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);
    console.log('🔄 Progresso resetado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao resetar progresso:', error);
    return false;
  }
};

// Função para simular progresso completo da Trilha 1 (para testes)
export const simularTrilha1Completa = async () => {
  try {
    const progress = await loadUserProgress();
    
    // Marcar história da Trilha 1 como concluída
    if (!progress.historiasConcluidas.includes('trilha_01')) {
      progress.historiasConcluidas.push('trilha_01');
    }
    
    // Marcar todas as questões da Trilha 1 como concluídas (usando IDs reais do Firestore)
    const qsSnap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', 'trilha_01')));
    for (const d of qsSnap.docs) {
      const qid = d.id;
      const existente = progress.questoesCompletadas.find(q => q.id === qid);
      if (!existente) {
        progress.questoesCompletadas.push({ id: qid, pontuacao: 10, dataConclusao: new Date().toISOString() });
      }
    }
    
    // Atualizar progresso da Trilha 1 para 100%
    progress.trilhasProgresso['trilha_01'] = 100;
    
    await saveUserProgress(progress);
    console.log('✅ Trilha 1 simulada como completa!');
    return true;
  } catch (error) {
    console.error('Erro ao simular Trilha 1 completa:', error);
    return false;
  }
};
