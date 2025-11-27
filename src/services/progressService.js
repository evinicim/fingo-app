// Serviço para gerenciar o progresso do usuário
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { getTrilhas, getModulosByTrilha } from './contentService';

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

// Função para carregar progresso do Firestore
const loadProgressFromFirestore = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const firestoreProgress = userData.progressoCache;
      
      if (firestoreProgress && firestoreProgress.userId === userId) {
        // ENDPOINT: Progresso carregado do Firestore
        // console.log('✅ Progresso carregado do Firestore');
        return firestoreProgress;
      }
    }
    
    return null;
  } catch (error) {
    // Mantido para debug de erros de sincronização
    console.error('Erro ao carregar progresso do Firestore:', error);
    return null;
  }
};

// Função para carregar progresso do usuário (com sincronização Firestore)
export const loadUserProgress = async (forceFromFirestore = false) => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      // Mantido para debug de problemas de autenticação
      // console.warn('⚠️ Usuário não autenticado, retornando progresso padrão');
      return defaultProgress;
    }

    const progressKey = getProgressKey();
    
    // Se forçado ou se não houver dados locais, tentar carregar do Firestore primeiro
    let progressData = await AsyncStorage.getItem(progressKey);
    let parsed = null;
    
    if (progressData) {
      parsed = JSON.parse(progressData);
      
      // Verificar se os dados pertencem ao usuário atual (validação de segurança)
      const storedUserId = parsed.userId;
      if (storedUserId && storedUserId !== uid) {
        // Mantido para debug de problemas de segurança
        // console.warn('⚠️ Dados de progresso de outro usuário detectados, limpando...');
        await AsyncStorage.removeItem(progressKey);
        progressData = null;
        parsed = null;
      }
    }
    
    // Se não houver dados locais ou forçado, tentar carregar do Firestore
    if (!progressData || forceFromFirestore) {
      const firestoreProgress = await loadProgressFromFirestore(uid);
      if (firestoreProgress) {
        // Sincronizar com AsyncStorage
        await AsyncStorage.setItem(progressKey, JSON.stringify(firestoreProgress));
        return firestoreProgress;
      }
    }
    
    // Se houver dados locais válidos, usar eles
    if (parsed) {
      // Migração: ids antigos de questões (q_1_1_1) não são compatíveis
      const hasLegacyIds = Array.isArray(parsed?.questoesCompletadas) && parsed.questoesCompletadas.some(q => /^q_\d/.test(q?.id));
      if (hasLegacyIds) {
        const migrated = { ...defaultProgress, historiasConcluidas: parsed.historiasConcluidas || [], userId: uid };
        await saveUserProgress(migrated);
        return migrated;
      }
      
      // Garantir que userId está presente
      if (!parsed.userId) {
        parsed.userId = uid;
        await saveUserProgress(parsed);
      }
      
      return parsed;
    }
    
    // Se não houver dados em nenhum lugar, inicializar progresso limpo
    await initializeUserProgress(uid);
    return defaultProgress;
  } catch (error) {
    console.error('Erro ao carregar progresso:', error);
    return defaultProgress;
  }
};

// Função para inicializar progresso limpo para um novo usuário
const initializeUserProgress = async (userId) => {
  try {
    const progressKey = getProgressKey();
    const cleanProgress = {
      ...defaultProgress,
      userId: userId,
      ultimaAtualizacao: new Date().toISOString()
    };
    
    // Salvar localmente
    await AsyncStorage.setItem(progressKey, JSON.stringify(cleanProgress));
    
    // Salvar no Firestore (garantir persistência)
    try {
      const ref = doc(db, 'users', userId);
      await setDoc(ref, { 
        progressoCache: cleanProgress,
        historiasConcluidas: [],
        questoesCompletadas: [],
        trilhasProgresso: {},
        dataCriacaoProgresso: new Date().toISOString()
      }, { merge: true });
      // ENDPOINT: Progresso inicializado no Firestore
      // console.log('✅ Progresso inicializado no Firestore para novo usuário');
    } catch (error) {
      // Mantido para debug de problemas de inicialização
      console.warn('⚠️ Erro ao salvar progresso no Firestore:', error);
    }
    
    // ENDPOINT: Progresso inicializado localmente
    // console.log('✅ Progresso inicializado para novo usuário:', userId);
  } catch (error) {
    console.error('Erro ao inicializar progresso:', error);
  }
};

// Função para salvar progresso do usuário (salva localmente E no Firestore)
export const saveUserProgress = async (progress) => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      // Mantido para debug de problemas de autenticação
      // console.warn('⚠️ Tentativa de salvar progresso sem usuário autenticado');
      return false;
    }

    const progressToSave = {
      ...progress,
      userId: uid, // Garantir que userId está sempre presente
      ultimaAtualizacao: new Date().toISOString()
    };
    
    // Salvar localmente (AsyncStorage) - para acesso rápido
    const progressKey = getProgressKey();
    await AsyncStorage.setItem(progressKey, JSON.stringify(progressToSave));
    
    // Persistir no Firestore - GARANTIR que está salvo na nuvem
    try {
      const ref = doc(db, 'users', uid);
      await setDoc(ref, { 
        progressoCache: progressToSave,
        // Também salvar campos individuais para facilitar consultas
        historiasConcluidas: progressToSave.historiasConcluidas || [],
        questoesCompletadas: progressToSave.questoesCompletadas || [],
        trilhasProgresso: progressToSave.trilhasProgresso || {},
        ultimaAtualizacaoProgresso: new Date().toISOString()
      }, { merge: true });
      // ENDPOINT: Progresso salvo no Firestore
      // console.log('✅ Progresso salvo no Firestore para usuário:', uid);
    } catch (error) {
      // Mantido para debug de erros críticos de sincronização
      console.error('❌ Erro ao salvar progresso no Firestore:', error);
      // Não falhar completamente, mas avisar
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
      // Invalidar cache de progresso
      invalidateProgressCache(trilhaId);
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
    
    // Invalidar cache de progresso
    if (trilhaId) {
      invalidateProgressCache(trilhaId);
    }

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

// Função para calcular progresso da trilha (OTIMIZADA com cache)
export const calculateTrilhaProgress = async (trilhaId) => {
  try {
    // Verificar cache primeiro
    const cacheKey = `progress_${trilhaId}`;
    const cached = progressCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < PROGRESS_CACHE_DURATION) {
      return cached.data;
    }
    
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
    
    // Salvar no cache
    progressCache.set(cacheKey, { data: porcentagem, timestamp: Date.now() });
    
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
    // Buscar trilhas para identificar a primeira
    const trilhas = await getTrilhas();
    const trilhasOrdenadas = trilhas.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    const primeiraTrilha = trilhasOrdenadas[0];
    
    // A primeira trilha sempre está desbloqueada
    if (trilhaId === primeiraTrilha?.id) return true;

    // Para outras trilhas: desbloqueia se a trilha anterior estiver 100% concluída
    const trilhaAnterior = await getTrilhaAnterior(trilhaId);
    if (!trilhaAnterior) return false;

    const progressoAnterior = await calculateTrilhaProgress(trilhaAnterior);
    return progressoAnterior >= 100;
  } catch (error) {
    console.error('Erro ao verificar desbloqueio da trilha:', error);
    return false;
  }
};

// Função para obter a trilha anterior (dinâmica - busca do Firestore)
const getTrilhaAnterior = async (trilhaId) => {
  try {
    const trilhas = await getTrilhas();
    const trilhasOrdenadas = trilhas.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    const index = trilhasOrdenadas.findIndex(t => t.id === trilhaId);
    return index > 0 ? trilhasOrdenadas[index - 1].id : null;
  } catch (error) {
    console.error('Erro ao buscar trilha anterior:', error);
    // Fallback para lista fixa se houver erro
    const trilhas = ['trilha_01', 'trilha_02', 'trilha_03', 'trilha_04', 'trilha_05', 'trilha_06', 'trilha_07', 'trilha_08'];
    const index = trilhas.indexOf(trilhaId);
    return index > 0 ? trilhas[index - 1] : null;
  }
};

// Função para verificar se uma trilha está completamente concluída (história + todas as questões)
export const isTrilhaCompletamenteConcluida = async (trilhaId) => {
  try {
    const progress = await loadUserProgress();
    const uid = auth.currentUser?.uid;
    
    // Verificar se o progresso pertence ao usuário correto
    if (progress?.userId && progress.userId !== uid) {
      console.warn(`⚠️ Progresso não pertence ao usuário atual. Trilha ${trilhaId} não concluída.`);
      return false;
    }
    
    // Verificar se a história foi concluída
    const historiaConcluida = progress.historiasConcluidas.includes(trilhaId);
    if (!historiaConcluida) {
      return false;
    }
    
    // Buscar todas as questões da trilha no Firestore
    let todasQuestoes = [];
    try {
      const qsSnap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', trilhaId)));
      todasQuestoes = qsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.warn(`Erro ao buscar questões da trilha ${trilhaId}:`, error);
      return false;
    }
    
    // Se não houver questões, considerar concluída apenas se a história foi concluída
    if (todasQuestoes.length === 0) {
      return historiaConcluida;
    }
    
    // Verificar se todas as questões foram completadas
    const questoesIdsCompletas = new Set(progress.questoesCompletadas.map(q => q.id));
    
    // Verificar também no Firestore se houver subcoleção
    if (uid) {
      try {
        const concluSnap = await getDocs(collection(db, 'users', uid, 'progresso', trilhaId, 'questoes'));
        concluSnap.docs.forEach(d => questoesIdsCompletas.add(d.id));
      } catch (error) {
        // Ignorar se subcoleção não existir
      }
    }
    
    // Verificar se todas as questões foram completadas
    for (const questao of todasQuestoes) {
      if (!questoesIdsCompletas.has(questao.id)) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar conclusão completa da trilha:', error);
    return false;
  }
};

// Cache de progresso calculado (evita recalcular)
const progressCache = new Map();
const PROGRESS_CACHE_DURATION = 30 * 1000; // 30 segundos

// Função para invalidar cache de progresso (chamar quando progresso for atualizado)
export const invalidateProgressCache = (trilhaId = null) => {
  if (trilhaId) {
    progressCache.delete(`progress_${trilhaId}`);
    progressCache.delete(`trilhas_status_${auth.currentUser?.uid || 'guest'}`);
    progressCache.delete(`user_stats_${auth.currentUser?.uid || 'guest'}`);
  } else {
    progressCache.clear();
  }
};

// Função para obter todas as trilhas com status de desbloqueio (OTIMIZADA)
export const getTrilhasWithUnlockStatus = async () => {
  try {
    const progress = await loadUserProgress();
    const trilhas = await getTrilhas();
    
    // Verificar cache primeiro
    const cacheKey = `trilhas_status_${auth.currentUser?.uid || 'guest'}`;
    const cached = progressCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < PROGRESS_CACHE_DURATION) {
      return cached.data;
    }
    
    // Ordenar trilhas por ordem antes de processar
    const trilhasOrdenadas = [...trilhas].sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    const primeiraTrilha = trilhasOrdenadas[0];
    
    // Calcular progresso de todas as trilhas em paralelo (mais rápido)
    const trilhasComStatus = await Promise.all(
      trilhasOrdenadas.map(async (t) => {
        const trilhaId = t.id;
        
        // Verificar desbloqueio (otimizado: primeira trilha sempre desbloqueada)
        let desbloqueada = true;
        if (trilhaId !== primeiraTrilha?.id) {
          const trilhaAnterior = await getTrilhaAnterior(trilhaId);
          if (trilhaAnterior) {
            // Usar progresso do cache se disponível
            const cacheProgressKey = `progress_${trilhaAnterior}`;
            const cachedProgress = progressCache.get(cacheProgressKey);
            const progressoAnterior = cachedProgress?.data || await calculateTrilhaProgress(trilhaAnterior);
            desbloqueada = progressoAnterior >= 100;
          } else {
            desbloqueada = false;
          }
        }
        
        const historiaConcluida = progress.historiasConcluidas.includes(trilhaId);
        
        // Usar progresso do cache se disponível
        const cacheProgressKey = `progress_${trilhaId}`;
        const cachedProgress = progressCache.get(cacheProgressKey);
        const progressoCalculado = cachedProgress?.data || await calculateTrilhaProgress(trilhaId);
        
        // Salvar no cache
        if (!cachedProgress) {
          progressCache.set(cacheProgressKey, { data: progressoCalculado, timestamp: Date.now() });
        }
        
        return { id: trilhaId, desbloqueada, historiaConcluida, progresso: progressoCalculado };
      })
    );
    
    // Salvar resultado completo no cache
    progressCache.set(cacheKey, { data: trilhasComStatus, timestamp: Date.now() });
    
    return trilhasComStatus;
  } catch (error) {
    console.error('Erro ao obter status das trilhas:', error);
    return [];
  }
};

// Estatísticas agregadas do usuário (OTIMIZADA com cache)
export const getUserStats = async () => {
  try {
    const uid = auth.currentUser?.uid;
    
    if (!uid) {
      // ENDPOINT: Usuário não autenticado
      // console.log('⚠️ Usuário não autenticado, retornando stats vazias');
      return { totalTrilhas: 0, trilhasConcluidas: 0, questoesRespondidas: 0, xp: 0, level: 1 };
    }
    
    // Verificar cache primeiro
    const cacheKey = `user_stats_${uid}`;
    const cached = progressCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < PROGRESS_CACHE_DURATION) {
      // ENDPOINT: Stats do cache
      // console.log('📊 Stats do cache:', cached.data);
      return cached.data;
    }
    
    const trilhas = await getTrilhas();
    const totalTrilhas = trilhas.length;
    const progress = await loadUserProgress();
    
    // ENDPOINT: Calculando stats (teste de performance)
    // console.log('📊 Calculando stats para usuário:', uid);
    // console.log('📊 Progresso carregado:', {
    //   historiasConcluidas: progress?.historiasConcluidas?.length || 0,
    //   questoesCompletadas: progress?.questoesCompletadas?.length || 0,
    //   userId: progress?.userId
    // });

    // Verificar se o progresso pertence ao usuário correto
    if (progress?.userId && progress.userId !== uid) {
      // Mantido para debug de problemas de segurança
      // console.warn('⚠️ Progresso pertence a outro usuário! Limpando cache e recalculando...');
      progressCache.clear();
      // Recarregar progresso limpo
      const cleanProgress = await loadUserProgress(true);
      if (cleanProgress) {
        progress.historiasConcluidas = cleanProgress.historiasConcluidas || [];
        progress.questoesCompletadas = cleanProgress.questoesCompletadas || [];
        progress.trilhasProgresso = cleanProgress.trilhasProgresso || {};
      }
    }

    // Calcular progresso de todas as trilhas e verificar conclusão
    let trilhasConcluidas = 0;
    let questoesRespondidas = 0;
    let xpQuestoes = 0;

    // Verificar cada trilha individualmente para garantir precisão
    const trilhasPromises = trilhas.map(async (t) => {
      const trilhaId = t.id;
      
      // Verificar se a trilha está completamente concluída (história + todas questões)
      const completamenteConcluida = await isTrilhaCompletamenteConcluida(trilhaId);
      if (completamenteConcluida) {
        trilhasConcluidas += 1;
      }
      
      // Contar questões respondidas desta trilha
      try {
        // Verificar no progresso local
        const questoesTrilha = progress.questoesCompletadas.filter(q => {
          // Se a questão tem trilhaId, usar isso
          if (q.trilhaId === trilhaId) return true;
          // Caso contrário, verificar no Firestore
          return false;
        });
        
        // Verificar também no Firestore
        try {
          const qsSnap = await getDocs(collection(db, 'users', uid, 'progresso', trilhaId, 'questoes'));
          questoesRespondidas += qsSnap.size;
          qsSnap.docs.forEach((d) => { 
            xpQuestoes += Number(d.data()?.pontuacao || 0); 
          });
        } catch (error) {
          // Se não houver subcoleção, usar dados locais
          questoesRespondidas += questoesTrilha.length;
          questoesTrilha.forEach(q => {
            xpQuestoes += Number(q.pontuacao || 0);
          });
        }
      } catch (error) {
        // Ignorar erros de subcoleção não existente
        // Mantido apenas para debug de problemas específicos
        // console.warn(`Erro ao buscar questões da trilha ${trilhaId}:`, error);
      }
    });

    await Promise.all(trilhasPromises);

    // XP por histórias concluídas (50 cada) usando cache local
    const xpHistorias = (progress?.historiasConcluidas?.length || 0) * 50;
    const xp = xpQuestoes + xpHistorias;
    const level = Math.max(1, Math.floor(xp / 100) + 1);

    const stats = { 
      totalTrilhas, 
      trilhasConcluidas, 
      questoesRespondidas, 
      xp, 
      level 
    };
    
    // ENDPOINT: Stats calculadas (teste de resultado)
    // console.log('📊 Stats calculadas:', stats);
    
    // Salvar no cache
    progressCache.set(cacheKey, { data: stats, timestamp: Date.now() });
    
    return stats;
  } catch (error) {
    console.error('❌ Erro ao calcular estatísticas do usuário:', error);
    return { totalTrilhas: 0, trilhasConcluidas: 0, questoesRespondidas: 0, xp: 0, level: 1 };
  }
};

// Função para debug - verificar status de todas as trilhas
// Esta função é mantida para testes e debug, mas os logs estão comentados
export const debugTrilhasStatus = async () => {
  try {
    const progress = await loadUserProgress();
    const trilhasData = await getTrilhas();
    const trilhasOrdenadas = trilhasData.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    
    // ENDPOINT: Debug de trilhas (usado durante testes)
    // console.log('=== DEBUG TRILHAS STATUS ===');
    // console.log('Progresso atual:', progress);
    
    for (const trilha of trilhasOrdenadas) {
      const trilhaId = trilha.id;
      const desbloqueada = await isTrilhaUnlocked(trilhaId);
      const historiaConcluida = progress.historiasConcluidas.includes(trilhaId);
      const progresso = progress.trilhasProgresso[trilhaId] || 0;
      
      // console.log(`${trilhaId}:`);
      // console.log(`  - Desbloqueada: ${desbloqueada}`);
      // console.log(`  - História concluída: ${historiaConcluida}`);
      // console.log(`  - Progresso: ${progresso}%`);
      
      const trilhaAnterior = await getTrilhaAnterior(trilhaId);
      if (trilhaAnterior) {
        const historiaAnterior = progress.historiasConcluidas.includes(trilhaAnterior);
        // console.log(`  - Trilha anterior (${trilhaAnterior}): história concluída = ${historiaAnterior}`);
      }
    }
    
    // console.log('=== FIM DEBUG ===');
  } catch (error) {
    console.error('Erro no debug:', error);
  }
};

// Função para resetar progresso (para testes)
export const resetProgress = async () => {
  try {
    const progressKey = getProgressKey();
    await AsyncStorage.removeItem(progressKey);
    
    // Limpar cache em memória
    progressCache.clear();
    
    // Limpar cache do Firestore
    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        const ref = doc(db, 'users', uid);
        await setDoc(ref, { progressoCache: defaultProgress }, { merge: true });
      } catch (error) {
        console.warn('Erro ao limpar cache do Firestore:', error);
      }
    }
    
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
    // ENDPOINT: Simulação de trilha completa (usado durante testes)
    // console.log('✅ Trilha 1 simulada como completa!');
    return true;
  } catch (error) {
    console.error('Erro ao simular Trilha 1 completa:', error);
    return false;
  }
};
