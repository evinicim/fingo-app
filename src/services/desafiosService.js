/**
 * Serviço para gerenciar desafios (missões) do usuário
 * 
 * Este arquivo contém funções para:
 * - Buscar desafios ativos disponíveis
 * - Buscar desafios do usuário (com status de conclusão)
 * - Marcar desafio como concluído
 */

import { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

/**
 * Busco todos os desafios ativos disponíveis no Firestore
 * 
 * Filtro apenas os desafios que estão ativos (ativo !== false).
 * Desafios inativos não aparecem para os usuários.
 * 
 * @returns {Array} - Array com todos os desafios ativos
 */
export async function getDesafiosAtivos() {
  const snap = await getDocs(collection(db, 'desafios'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.ativo !== false);
}

/**
 * Busco os desafios do usuário atual (com status de conclusão)
 * 
 * Cada usuário tem uma subcoleção 'desafios' dentro do seu documento.
 * Lá ficam salvos quais desafios ele completou e quando.
 * 
 * @returns {Array} - Array com os desafios do usuário (vazio se não estiver logado)
 */
export async function getDesafiosDoUsuario() {
  const uid = auth.currentUser?.uid;
  if (!uid) return []; // Se não estiver logado, retorno vazio
  const snap = await getDocs(collection(db, 'users', uid, 'desafios'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Marco um desafio como concluído para o usuário atual
 * 
 * Salvo na subcoleção 'desafios' do usuário que ele completou o desafio,
 * quando completou, e se já recebeu a recompensa.
 * 
 * @param {string} desafioId - ID do desafio que foi concluído
 * @returns {boolean} - true se conseguiu salvar, false se não estiver logado
 */
export async function concluirDesafio(desafioId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return false; // Se não estiver logado, não posso salvar
  
  // Salvo na subcoleção de desafios do usuário
  const ref = doc(db, 'users', uid, 'desafios', desafioId);
  await setDoc(ref, { 
    concluido: true, 
    dataConclusao: serverTimestamp(), // Uso serverTimestamp para garantir hora correta
    recompensaRecebida: false // Ainda não recebeu a recompensa
  }, { merge: true }); // merge: true para não sobrescrever outros campos
  
  return true;
}


