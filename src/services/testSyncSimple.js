/**
 * Teste simples de sincronização que funciona no ambiente React Native
 */

import { loadUserProgress, saveUserProgress } from './progressService';
import { syncFromFirebase, syncToFirebase, checkSyncConflicts } from './syncService';
import { auth } from './firebaseConfig';

export const testSyncSimple = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: 'Usuário não logado' };
    }

    const currentProgress = await loadUserProgress();

    let conflicts = null;
    try {
      conflicts = await checkSyncConflicts();
    } catch (conflictError) {
      // Ignora erros de conflito
    }

    let syncResult = false;
    try {
      syncResult = await syncToFirebase(currentProgress);
    } catch (syncError) {
      syncResult = false;
    }

    const testProgress = {
      ...currentProgress,
      historiasConcluidas: [...(currentProgress.historiasConcluidas || []), 'teste_sync'],
      ultimaAtualizacao: new Date().toISOString()
    };

    const saveResult = await saveUserProgress(testProgress);
    return {
      success: true,
      user: user.email,
      progress: currentProgress,
      syncResult: syncResult,
      saveResult: saveResult
    };

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const cleanupTestDataSimple = async () => {
  try {
    const progress = await loadUserProgress();
    
    if (progress.historiasConcluidas?.includes('teste_sync')) {
      progress.historiasConcluidas = progress.historiasConcluidas.filter(id => id !== 'teste_sync');
      await saveUserProgress(progress);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao limpar dados de teste:', error);
    return false;
  }
};
