// Serviço para gerenciar o progresso do usuário
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';

const PROGRESS_KEY = 'user_progress';

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
    const progressData = await AsyncStorage.getItem(PROGRESS_KEY);
    if (progressData) {
      return JSON.parse(progressData);
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
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progressToSave));
    // Persistir no Firestore se logado
    const uid = auth.currentUser?.uid;
    if (uid) {
      const ref = doc(db, 'users', uid);
      await setDoc(ref, { progressoCache: progressToSave }, { merge: true });
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
export const markQuestaoAsCompleted = async (questaoId, pontuacao = 0) => {
  try {
    const progress = await loadUserProgress();
    
    const questaoExistente = progress.questoesCompletadas.find(q => q.id === questaoId);
    if (questaoExistente) {
      questaoExistente.pontuacao = Math.max(questaoExistente.pontuacao, pontuacao);
      questaoExistente.dataConclusao = new Date().toISOString();
    } else {
      progress.questoesCompletadas.push({
        id: questaoId,
        pontuacao,
        dataConclusao: new Date().toISOString()
      });
    }
    
    await saveUserProgress(progress);
    return true;
  } catch (error) {
    console.error('Erro ao marcar questão como completada:', error);
    return false;
  }
};

// Função para verificar se questão foi completada
export const isQuestaoCompleted = async (questaoId) => {
  try {
    const progress = await loadUserProgress();
    return progress.questoesCompletadas.some(q => q.id === questaoId);
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
    // Buscar quantidade real de questões da trilha no Firestore
    const qsSnap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', trilhaId)));
    const totalQuestoes = qsSnap.size;
    const totalItens = 1 + totalQuestoes; // 1 história + questões
    let itensCompletados = 0;
    
    // Verificar se história foi concluída (50% do progresso)
    if (progress.historiasConcluidas.includes(trilhaId)) {
      itensCompletados += 1;
    }
    
    // Verificar questões completadas (50% do progresso)
    const questoesIds = progress.questoesCompletadas.map(q => q.id);
    // considera apenas ids que pertencem à trilha (prefixo ou verificar pela coleção local)
    const questoesCompletadas = questoesIds.filter(id => id.includes(`trilha_`) && id.includes(trilhaId)).length;
    
    itensCompletados += questoesCompletadas;
    
    // Calcular porcentagem
    const porcentagem = Math.round((itensCompletados / totalItens) * 100);
    
    // Salvar progresso calculado
    await updateTrilhaProgress(trilhaId, porcentagem);
    // Persistir no Firestore por trilha
    const uid = auth.currentUser?.uid;
    if (uid) {
      const progRef = doc(db, 'users', uid, 'progresso', trilhaId);
      await setDoc(progRef, {
        progresso: porcentagem,
        historiasConcluidas: progress.historiasConcluidas.includes(trilhaId),
        questoesCompletadas: progress.questoesCompletadas.filter(q => q.id.includes(trilhaId)).map(q => q.id),
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
    const progress = await loadUserProgress();
    
    // A primeira trilha sempre está desbloqueada
    if (trilhaId === 'trilha_01') {
      return true;
    }
    
    // Para outras trilhas, verificar se a anterior foi COMPLETAMENTE concluída
    const trilhaAnterior = getTrilhaAnterior(trilhaId);
    if (trilhaAnterior) {
      // Verificar se a trilha anterior tem história concluída
      const historiaConcluida = progress.historiasConcluidas.includes(trilhaAnterior);
      if (!historiaConcluida) {
        return false;
      }
      
      // Verificar se todas as questões da trilha anterior foram respondidas
      // Buscar todas as questões da trilha anterior (Firestore)
      const qsSnap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', trilhaAnterior)));
      const todasQuestoesAnterior = qsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      console.log(`\n🔍 Verificando desbloqueio da ${trilhaId}:`);
      console.log(`📚 Trilha anterior: ${trilhaAnterior}`);
      console.log(`📖 História da ${trilhaAnterior} concluída: ${historiaConcluida}`);
      console.log(`❓ Questões da ${trilhaAnterior}:`, todasQuestoesAnterior.map(q => q.id));
      console.log(`✅ Questões completadas:`, progress.questoesCompletadas.map(q => q.id));
      
      // Verificar se todas as questões foram completadas
      let questoesFaltando = [];
      for (const questao of todasQuestoesAnterior) {
        const questaoCompleta = progress.questoesCompletadas.some(q => q.id === questao.id);
        console.log(`   ${questaoCompleta ? '✅' : '❌'} ${questao.id}: ${questaoCompleta ? 'Completa' : 'Faltando'}`);
        if (!questaoCompleta) {
          questoesFaltando.push(questao.id);
        }
      }
      
      if (questoesFaltando.length > 0) {
        console.log(`❌ ${trilhaId} BLOQUEADA: Faltam ${questoesFaltando.length} questões da ${trilhaAnterior}:`, questoesFaltando);
        return false;
      }
      
      console.log(`✅ ${trilhaId} DESBLOQUEADA: Todas as questões da ${trilhaAnterior} foram respondidas!`);
      
      return true;
    }
    
    return false;
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
    const trilhas = ['trilha_01', 'trilha_02', 'trilha_03', 'trilha_04', 'trilha_05'];
    
    const trilhasComStatus = await Promise.all(
      trilhas.map(async (trilhaId) => {
        const desbloqueada = await isTrilhaUnlocked(trilhaId);
        const historiaConcluida = progress.historiasConcluidas.includes(trilhaId);
        const progressoCalculado = await calculateTrilhaProgress(trilhaId);
        
        return {
          id: trilhaId,
          desbloqueada,
          historiaConcluida,
          progresso: progressoCalculado
        };
      })
    );
    
    return trilhasComStatus;
  } catch (error) {
    console.error('Erro ao obter status das trilhas:', error);
    return [];
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
    
    // Marcar todas as questões da Trilha 1 como concluídas
    const questoesTrilha1 = ['q_1_1_1', 'q_1_1_2', 'q_1_1_3'];
    for (const questaoId of questoesTrilha1) {
      const questaoExistente = progress.questoesCompletadas.find(q => q.id === questaoId);
      if (!questaoExistente) {
        progress.questoesCompletadas.push({
          id: questaoId,
          pontuacao: 10,
          dataConclusao: new Date().toISOString()
        });
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
