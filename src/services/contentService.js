import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Trilhas
export async function getTrilhas() {
  const snap = await getDocs(query(collection(db, 'trilhaId'), orderBy('ordem')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getTrilhaById(trilhaId) {
  const ref = doc(db, 'trilhaId', trilhaId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Modulos
export async function getModulosByTrilha(trilhaId) {
  const snap = await getDocs(query(collection(db, 'moduloId'), where('trilhaId', '==', trilhaId), orderBy('ordem')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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

// Questoes
export async function getQuestoesByModulo(moduloId) {
  const snap = await getDocs(query(collection(db, 'questao'), where('moduloId', '==', moduloId), orderBy('ordem')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getProximaTrilhaDesbloqueada(trilhas, progressoPorTrilha) {
  // progressoPorTrilha: Map<trilhaId, { progresso:number }>
  for (const trilha of trilhas) {
    const prog = progressoPorTrilha.get(trilha.id)?.progresso ?? 0;
    if (prog < 100) return trilha.id;
  }
  return trilhas[0]?.id;
}


