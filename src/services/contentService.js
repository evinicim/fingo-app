/**
 * Serviço para buscar conteúdo do Firestore
 * 
 * Este arquivo contém funções para buscar:
 * - Trilhas de aprendizado
 * - Módulos de cada trilha
 * - Histórias educacionais
 * - Questões de cada módulo/trilha
 * 
 * Todas as funções usam cache para melhorar a performance.
 */

import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getCache, setCache } from './cacheService';

/**
 * Busco todas as trilhas de aprendizado do Firestore
 * 
 * Primeiro tento buscar do cache (mais rápido). Se não tiver cache,
 * busco do Firestore e salvo no cache para próximas consultas.
 * 
 * @returns {Array} - Array com todas as trilhas ordenadas por ordem
 */
export async function getTrilhas() {
  // Primeiro tento buscar do cache (é mais rápido)
  const cached = await getCache('trilhas');
  if (cached) {
    // ENDPOINT: Cache hit - trilhas carregadas do cache
    // console.log('📦 Trilhas carregadas do cache');
    return cached;
  }
  
  // Se não tiver cache, busco do Firestore
  // ENDPOINT: Cache miss - buscando do Firestore
  // console.log('🔥 Buscando trilhas do Firestore...');
  const snap = await getDocs(query(collection(db, 'trilhaId'), orderBy('ordem')));
  const itens = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  // Filtro apenas documentos válidos (que começam com "trilha_")
  // E ordeno por ordem de forma defensiva (se não tiver ordem, vai pro final)
  const trilhas = itens
    .filter(t => (t?.id || '').startsWith('trilha_'))
    .sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
  
  // Salvo no cache para próximas consultas serem mais rápidas
  await setCache('trilhas', trilhas);
  
  return trilhas;
}

/**
 * Busco uma trilha específica pelo ID
 * 
 * @param {string} trilhaId - ID da trilha (ex: "trilha_01")
 * @returns {object|null} - Objeto com os dados da trilha ou null se não encontrar
 */
export async function getTrilhaById(trilhaId) {
  const ref = doc(db, 'trilhaId', trilhaId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Busco todos os módulos de uma trilha específica
 * 
 * Tento buscar primeiro na coleção 'moduloId', se não encontrar,
 * tento na coleção 'modulos'. Isso garante compatibilidade com diferentes
 * estruturas de dados no Firestore.
 * 
 * @param {string} trilhaId - ID da trilha (ex: "trilha_01")
 * @returns {Array} - Array com os módulos da trilha ordenados por ordem
 */
export async function getModulosByTrilha(trilhaId) {
  try {
    // Primeiro tento buscar na coleção 'moduloId'
    let snap = await getDocs(query(collection(db, 'moduloId'), where('trilhaId', '==', trilhaId), orderBy('ordem')));
    if (snap.docs.length > 0) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    
    // Se não encontrar, tento na coleção 'modulos'
    snap = await getDocs(query(collection(db, 'modulos'), where('trilhaId', '==', trilhaId), orderBy('ordem')));
    if (snap.docs.length > 0) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    
    return [];
  } catch (e) {
    // Se o Firestore exigir um índice composto que não existe,
    // faço fallback: busco sem orderBy e ordeno em memória
    if (e?.code === 'failed-precondition' || String(e?.message || '').includes('requires an index')) {
      // Tento 'moduloId' sem orderBy
      let snap = await getDocs(query(collection(db, 'moduloId'), where('trilhaId', '==', trilhaId)));
      if (snap.docs.length > 0) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
      }
      
      // Tento 'modulos' sem orderBy
      snap = await getDocs(query(collection(db, 'modulos'), where('trilhaId', '==', trilhaId)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    }
    throw e;
  }
}

/**
 * Busco um módulo específico pelo ID
 * 
 * Tento buscar primeiro na coleção 'moduloId', se não encontrar,
 * tento na coleção 'modulos'. Isso garante compatibilidade.
 * 
 * @param {string} moduloId - ID do módulo (ex: "trilha_01_modulo_01")
 * @returns {object|null} - Objeto com os dados do módulo ou null se não encontrar
 */
export async function getModuloById(moduloId) {
  try {
    // Primeiro tento buscar na coleção 'moduloId'
    let ref = doc(db, 'moduloId', moduloId);
    let snap = await getDoc(ref);
    
    if (snap.exists()) {
      // ENDPOINT: Módulo encontrado
      // console.log('✅ Módulo encontrado em "moduloId":', moduloId);
      return { id: snap.id, ...snap.data() };
    }
    
    // Se não encontrar, tento na coleção 'modulos'
    // ENDPOINT: Fallback para coleção 'modulos'
    // console.log('⚠️ Módulo não encontrado em "moduloId", tentando "modulos"...');
    ref = doc(db, 'modulos', moduloId);
    snap = await getDoc(ref);
    
    if (snap.exists()) {
      // ENDPOINT: Módulo encontrado no fallback
      // console.log('✅ Módulo encontrado em "modulos":', moduloId);
      return { id: snap.id, ...snap.data() };
    }
    
    // Mantido para debug de módulos não encontrados
    console.warn('❌ Módulo não encontrado em nenhuma coleção:', moduloId);
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar módulo:', error);
    return null;
  }
}

/**
 * Busco a história de um módulo específico
 * 
 * @param {string} moduloId - ID do módulo
 * @returns {object|null} - Objeto com os dados da história ou null se não encontrar
 */
export async function getHistoriaByModulo(moduloId) {
  const snap = await getDocs(query(collection(db, 'historias'), where('moduloId', '==', moduloId)));
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return docs[0] || null;
}

/**
 * Busco a história de uma trilha específica
 * 
 * Tento buscar ordenado por ordem. Se o Firestore exigir índice,
 * faço fallback buscando sem orderBy e ordenando em memória.
 * 
 * @param {string} trilhaId - ID da trilha (ex: "trilha_01")
 * @returns {object|null} - Objeto com os dados da história ou null se não encontrar
 */
export async function getHistoriaByTrilha(trilhaId) {
  try {
    const snap = await getDocs(query(collection(db, 'historias'), where('trilhaId', '==', trilhaId), orderBy('ordem')));
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return docs[0] || null;
  } catch (e) {
    // Se precisar de índice composto, busco sem orderBy e ordeno em memória
    if (e?.code === 'failed-precondition' || String(e?.message || '').includes('requires an index')) {
      const snap = await getDocs(query(collection(db, 'historias'), where('trilhaId', '==', trilhaId)));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
      return docs[0] || null;
    }
    throw e;
  }
}

/**
 * Busco todas as questões de um módulo específico
 * 
 * Tento buscar ordenado por ordem. Se o Firestore exigir índice,
 * faço fallback buscando sem orderBy e ordenando em memória.
 * 
 * @param {string} moduloId - ID do módulo
 * @returns {Array} - Array com todas as questões do módulo ordenadas por ordem
 */
export async function getQuestoesByModulo(moduloId) {
  try {
    const snap = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', moduloId), orderBy('ordem')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // Se precisar de índice composto, busco sem orderBy e ordeno em memória
    if (e?.code === 'failed-precondition' || String(e?.message || '').includes('requires an index')) {
      const snap = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', moduloId)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    }
    throw e;
  }
}

/**
 * Encontro a próxima trilha que ainda não está 100% concluída
 * 
 * Percorro as trilhas em ordem e retorno a primeira que tiver
 * progresso menor que 100%. Se todas estiverem completas, retorno a primeira.
 * 
 * @param {Array} trilhas - Array com todas as trilhas
 * @param {Map} progressoPorTrilha - Map com o progresso de cada trilha { trilhaId: { progresso: number } }
 * @returns {string} - ID da próxima trilha desbloqueada
 */
export async function getProximaTrilhaDesbloqueada(trilhas, progressoPorTrilha) {
  // Percorro as trilhas e encontro a primeira que não está 100% completa
  for (const trilha of trilhas) {
    const prog = progressoPorTrilha.get(trilha.id)?.progresso ?? 0;
    if (prog < 100) return trilha.id;
  }
  // Se todas estiverem completas, retorno a primeira trilha
  return trilhas[0]?.id;
}


/**
 * Busco todas as questões de uma trilha específica
 * 
 * Primeiro tento buscar diretamente por trilhaId. Se não encontrar questões
 * ou se algumas questões não tiverem trilhaId setado, faço fallback:
 * busco todas as questões de todos os módulos da trilha e agrego.
 * 
 * @param {string} trilhaId - ID da trilha (ex: "trilha_01")
 * @returns {Array} - Array com todas as questões da trilha ordenadas por ordem
 */
export async function getQuestoesByTrilha(trilhaId) {
  try {
    // Primeiro tento buscar questões que têm trilhaId diretamente
    const snap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', trilhaId)));
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (items.length > 0) {
      return items.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    }
  } catch (_) {}
  
  // Fallback: se não encontrar questões com trilhaId, agrego por módulos
  // Isso acontece quando algumas questões antigas não têm trilhaId setado
  const modulos = await getModulosByTrilha(trilhaId);
  const agregadas = [];
  for (const m of modulos) {
    try {
      // Busco questões de cada módulo da trilha
      const s = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', m.id)));
      s.docs.forEach(d => agregadas.push({ id: d.id, ...d.data(), moduloId: m.id }));
    } catch (_) {}
  }
  return agregadas.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
}

/**
 * Conto quantas questões uma trilha tem
 * 
 * @param {string} trilhaId - ID da trilha (ex: "trilha_01")
 * @returns {number} - Número de questões da trilha
 */
export async function getQuestoesCountByTrilha(trilhaId) {
  const qs = await getQuestoesByTrilha(trilhaId);
  return qs.length;
}


