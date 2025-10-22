/**
 * Serviço de sincronização robusta entre Firebase e AsyncStorage
 * Garante que o progresso seja sempre salvo no Firebase como fonte da verdade
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

const getProgressKey = () => {
  const uid = auth.currentUser?.uid;
  return uid ? `user_progress_${uid}` : 'user_progress';
};

/**
 * Sincroniza progresso do Firebase para AsyncStorage (quando usuário faz login)
 */
export const syncFromFirebase = async () => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return null;

    console.log('🔄 Sincronizando progresso do Firebase...');
    
    // Buscar progresso principal do Firebase
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log('📝 Usuário não tem progresso no Firebase ainda');
      return null;
    }

    const userData = userSnap.data();
    const firebaseProgress = userData.progresso || {};

    // Buscar progresso detalhado por trilha
    const progressRef = collection(db, 'users', uid, 'progresso');
    const progressSnap = await getDocs(progressRef);
    
    const trilhasProgresso = {};
    progressSnap.docs.forEach(doc => {
      trilhasProgresso[doc.id] = doc.data();
    });

    // Montar progresso completo
    const progressCompleto = {
      historiasConcluidas: firebaseProgress.historiasConcluidas || [],
      questoesCompletadas: firebaseProgress.questoesCompletadas || [],
      trilhasProgresso: trilhasProgresso,
      ultimaAtualizacao: new Date().toISOString(),
      sincronizado: true
    };

    // Salvar no AsyncStorage
    await AsyncStorage.setItem(getProgressKey(), JSON.stringify(progressCompleto));
    
    console.log('✅ Progresso sincronizado do Firebase');
    return progressCompleto;
  } catch (error) {
    console.error('❌ Erro ao sincronizar do Firebase:', error);
    return null;
  }
};

/**
 * Sincroniza progresso do AsyncStorage para Firebase
 */
export const syncToFirebase = async (progress) => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.log('⚠️ Usuário não logado, salvando apenas localmente');
      return false;
    }

    console.log('🔄 Sincronizando progresso para Firebase...');

    // Salvar progresso principal
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      progresso: {
        historiasConcluidas: progress.historiasConcluidas || [],
        questoesCompletadas: progress.questoesCompletadas || [],
        ultimaAtualizacao: progress.ultimaAtualizacao
      }
    }, { merge: true });

    // Salvar progresso detalhado por trilha
    for (const [trilhaId, trilhaProgress] of Object.entries(progress.trilhasProgresso || {})) {
      const trilhaRef = doc(db, 'users', uid, 'progresso', trilhaId);
      await setDoc(trilhaRef, {
        ...trilhaProgress,
        ultimaAtualizacao: new Date().toISOString()
      }, { merge: true });
    }

    console.log('✅ Progresso sincronizado para Firebase');
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar para Firebase:', error);
    return false;
  }
};

/**
 * Força sincronização completa (Firebase -> AsyncStorage -> Firebase)
 */
export const forceSync = async () => {
  try {
    console.log('🔄 Forçando sincronização completa...');
    
    // 1. Buscar do Firebase
    const firebaseProgress = await syncFromFirebase();
    
    if (firebaseProgress) {
      // 2. Sincronizar de volta para garantir consistência
      await syncToFirebase(firebaseProgress);
    }
    
    return firebaseProgress;
  } catch (error) {
    console.error('❌ Erro na sincronização forçada:', error);
    return null;
  }
};

/**
 * Verifica se há conflitos entre Firebase e AsyncStorage
 */
export const checkSyncConflicts = async () => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) return null;

    // Buscar do AsyncStorage
    const localProgress = await AsyncStorage.getItem(getProgressKey());
    const local = localProgress ? JSON.parse(localProgress) : null;

    // Buscar do Firebase
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const firebase = userSnap.exists() ? userSnap.data().progresso : null;

    if (!local && !firebase) return null;
    if (!local || !firebase) return { source: local ? 'local' : 'firebase', data: local || firebase };

    // Comparar timestamps
    const localTime = new Date(local.ultimaAtualizacao).getTime();
    const firebaseTime = new Date(firebase.ultimaAtualizacao).getTime();

    if (Math.abs(localTime - firebaseTime) > 60000) { // Mais de 1 minuto de diferença
      return {
        conflict: true,
        local: local,
        firebase: firebase,
        newer: localTime > firebaseTime ? 'local' : 'firebase'
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Erro ao verificar conflitos:', error);
    return null;
  }
};
