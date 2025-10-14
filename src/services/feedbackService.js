import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export async function enviarFeedback({ tipo, itemId, rating = 5, comentario = '' }) {
  const uid = auth.currentUser?.uid || 'anon';
  const feedbackRef = doc(collection(db, 'feedback'));
  const payload = {
    userId: uid,
    tipo, // 'questao' | 'historia' | 'video' | 'geral'
    itemId,
    rating,
    comentario,
    data: serverTimestamp(),
    respondido: false,
  };
  await setDoc(feedbackRef, payload);
  return { id: feedbackRef.id, ...payload };
}


