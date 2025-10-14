import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getCache, setCache } from './cacheService';

// Trilhas (com cache de 5 minutos)
export async function getTrilhas() {
  // Tentar buscar do cache primeiro
  const cached = await getCache('trilhas');
  if (cached) {
    console.log('📦 Trilhas carregadas do cache');
    return cached;
  }
  
  // Se não tiver cache, buscar do Firestore
  console.log('🔥 Buscando trilhas do Firestore...');
  const snap = await getDocs(query(collection(db, 'trilhaId'), orderBy('ordem')));
  const itens = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  // Filtra documentos válidos (ids do padrão trilha_*) e ordena de forma defensiva
  const trilhas = itens
    .filter(t => (t?.id || '').startsWith('trilha_'))
    .sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
  
  // Salvar no cache
  await setCache('trilhas', trilhas);
  
  return trilhas;
}

export async function getTrilhaById(trilhaId) {
  const ref = doc(db, 'trilhaId', trilhaId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Modulos
export async function getModulosByTrilha(trilhaId) {
  try {
    const snap = await getDocs(query(collection(db, 'moduloId'), where('trilhaId', '==', trilhaId), orderBy('ordem')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // Fallback quando o Firestore exigir índice composto: tenta sem orderBy e ordena em memória
    if (e?.code === 'failed-precondition' || String(e?.message || '').includes('requires an index')) {
      const snap = await getDocs(query(collection(db, 'moduloId'), where('trilhaId', '==', trilhaId)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    }
    throw e;
  }
}

export async function getModuloById(moduloId) {
  const ref = doc(db, 'moduloId', moduloId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Historias
export async function getHistoriaByModulo(moduloId) {
  const snap = await getDocs(query(collection(db, 'historias'), where('moduloId', '==', moduloId)));
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return docs[0] || null;
}

export async function getHistoriaByTrilha(trilhaId) {
  try {
    const snap = await getDocs(query(collection(db, 'historias'), where('trilhaId', '==', trilhaId), orderBy('ordem')));
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return docs[0] || null;
  } catch (e) {
    if (e?.code === 'failed-precondition' || String(e?.message || '').includes('requires an index')) {
      const snap = await getDocs(query(collection(db, 'historias'), where('trilhaId', '==', trilhaId)));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
      return docs[0] || null;
    }
    throw e;
  }
}

// Questoes
export async function getQuestoesByModulo(moduloId) {
  try {
    const snap = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', moduloId), orderBy('ordem')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    if (e?.code === 'failed-precondition' || String(e?.message || '').includes('requires an index')) {
      const snap = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', moduloId)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    }
    throw e;
  }
}

export async function getProximaTrilhaDesbloqueada(trilhas, progressoPorTrilha) {
  // progressoPorTrilha: Map<trilhaId, { progresso:number }>
  for (const trilha of trilhas) {
    const prog = progressoPorTrilha.get(trilha.id)?.progresso ?? 0;
    if (prog < 100) return trilha.id;
  }
  return trilhas[0]?.id;
}


// Questoes por trilha (agregadas)
export async function getQuestoesByTrilha(trilhaId) {
  try {
    const snap = await getDocs(query(collection(db, 'questao'), where('trilhaId', '==', trilhaId)));
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (items.length > 0) {
      return items.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
    }
  } catch (_) {}
  // Fallback: agregar por módulos quando algumas questões não têm trilhaId setado
  const modulos = await getModulosByTrilha(trilhaId);
  const agregadas = [];
  for (const m of modulos) {
    try {
      const s = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', m.id)));
      s.docs.forEach(d => agregadas.push({ id: d.id, ...d.data(), moduloId: m.id }));
    } catch (_) {}
  }
  return agregadas.sort((a, b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
}

export async function getQuestoesCountByTrilha(trilhaId) {
  const qs = await getQuestoesByTrilha(trilhaId);
  return qs.length;
}


