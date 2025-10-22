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

// Questões
export async function getQuestoesByModulo(moduloId) {
  const q = query(collection(db, 'questao'), where('moduloId', '==', moduloId), orderBy('ordem'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getQuestoesByTrilha(trilhaId) {
  const q = query(collection(db, 'questao'), where('trilhaId', '==', trilhaId), orderBy('ordem'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getQuestoesCountByTrilha(trilhaId) {
  const q = query(collection(db, 'questao'), where('trilhaId', '==', trilhaId));
  const snap = await getDocs(q);
  return snap.size;
}

export async function getQuestaoById(questaoId) {
  const ref = doc(db, 'questao', questaoId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Histórias
export async function getHistoriasByTrilha(trilhaId) {
  const q = query(collection(db, 'historia'), where('trilhaId', '==', trilhaId), orderBy('ordem'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getHistoriaById(historiaId) {
  const ref = doc(db, 'historia', historiaId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Buscar dados de FAQ do Firebase
 */
export async function getFAQData() {
  try {
    const snap = await getDocs(collection(db, 'faq'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar FAQ:', error);
    // Fallback para dados estáticos
    return [
      {
        id: 'faq_1',
        question: "Como eu posso trocar a minha senha?",
        answer: "Você pode trocar a sua senha na página de configurações do perfil. A opção para redefinir a senha estará disponível no menu."
      },
      {
        id: 'faq_2', 
        question: "O que é educação financeira gamificada?",
        answer: "É uma metodologia que usa elementos de jogos para ensinar conceitos financeiros de forma divertida e interativa, ajudando você a aprender sobre dinheiro de um jeito novo."
      },
      {
        id: 'faq_3',
        question: "Posso usar o aplicativo offline?",
        answer: "O aplicativo precisa de conexão com a internet para carregar os conteúdos e sincronizar seu progresso. No entanto, algumas atividades podem ser acessadas offline."
      }
    ];
  }
}

/**
 * Buscar avatares disponíveis do Firebase
 */
export async function getAvatares() {
  try {
    const snap = await getDocs(collection(db, 'avatares'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar avatares:', error);
    // Fallback para dados estáticos
    return [
      { id: '1', icon: '👦', name: 'João' },
      { id: '2', icon: '👧', name: 'Maria' },
      { id: '3', icon: '🧑', name: 'Alex' },
      { id: '4', icon: '👩', name: 'Ana' },
      { id: '5', icon: '👨', name: 'Carlos' },
      { id: '6', icon: '👩‍🦱', name: 'Sofia' }
    ];
  }
}

/**
 * Buscar níveis de conhecimento do Firebase
 */
export async function getNiveisConhecimento() {
  try {
    const snap = await getDocs(collection(db, 'niveisConhecimento'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar níveis:', error);
    // Fallback para dados estáticos
    return [
      { id: 'iniciante', label: 'Iniciante', description: 'Estou começando a aprender sobre finanças', icon: '🌱' },
      { id: 'intermediario', label: 'Intermediário', description: 'Já tenho algumas noções básicas', icon: '📈' },
      { id: 'avancado', label: 'Avançado', description: 'Tenho conhecimento sólido em finanças', icon: '💎' }
    ];
  }
}