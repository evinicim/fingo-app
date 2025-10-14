import { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export async function getDesafiosAtivos() {
  const snap = await getDocs(collection(db, 'desafios'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.ativo !== false);
}

export async function getDesafiosDoUsuario() {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  const snap = await getDocs(collection(db, 'users', uid, 'desafios'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function concluirDesafio(desafioId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return false;
  const ref = doc(db, 'users', uid, 'desafios', desafioId);
  await setDoc(ref, { concluido: true, dataConclusao: serverTimestamp(), recompensaRecebida: false }, { merge: true });
  return true;
}


