/**
 * Teste simples de sincronização que funciona no ambiente React Native
 */

import { loadUserProgress, saveUserProgress } from './progressService';
import { syncFromFirebase, syncToFirebase, checkSyncConflicts } from './syncService';
import { auth } from './firebaseConfig';

export const testSyncSimple = async () => {
  console.log('🧪 INICIANDO TESTE SIMPLES DE SINCRONIZAÇÃO...\n');

  try {
    // Teste 1: Verificar se usuário está logado
    console.log('1️⃣ Verificando autenticação...');
    const user = auth.currentUser;
    if (!user) {
      console.log('⚠️ Usuário não logado - teste limitado');
      return { success: false, message: 'Usuário não logado' };
    }
    console.log(`✅ Usuário logado: ${user.email}`);

    // Teste 2: Carregar progresso atual
    console.log('\n2️⃣ Carregando progresso atual...');
    const currentProgress = await loadUserProgress();
    console.log('📊 Progresso atual:', {
      historiasConcluidas: currentProgress.historiasConcluidas?.length || 0,
      questoesCompletadas: currentProgress.questoesCompletadas?.length || 0,
      trilhasProgresso: Object.keys(currentProgress.trilhasProgresso || {}).length,
      ultimaAtualizacao: currentProgress.ultimaAtualizacao
    });

    // Teste 3: Verificar conflitos
    console.log('\n3️⃣ Verificando conflitos...');
    const conflicts = await checkSyncConflicts();
    if (conflicts?.conflict) {
      console.log('⚠️ Conflito detectado - resolvendo...');
    } else {
      console.log('✅ Nenhum conflito detectado');
    }

    // Teste 4: Sincronizar com Firebase
    console.log('\n4️⃣ Testando sincronização...');
    const syncResult = await syncToFirebase(currentProgress);
    if (syncResult) {
      console.log('✅ Sincronização com Firebase bem-sucedida');
    } else {
      console.log('⚠️ Falha na sincronização com Firebase');
    }

    // Teste 5: Simular atualização
    console.log('\n5️⃣ Simulando atualização de progresso...');
    const testProgress = {
      ...currentProgress,
      historiasConcluidas: [...(currentProgress.historiasConcluidas || []), 'teste_sync'],
      ultimaAtualizacao: new Date().toISOString()
    };

    const saveResult = await saveUserProgress(testProgress);
    if (saveResult) {
      console.log('✅ Progresso de teste salvo com sucesso');
    } else {
      console.log('❌ Falha ao salvar progresso de teste');
    }

    console.log('\n🎉 TESTE SIMPLES CONCLUÍDO!');
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
    console.log('🧹 Limpando dados de teste...');
    const progress = await loadUserProgress();
    
    if (progress.historiasConcluidas?.includes('teste_sync')) {
      progress.historiasConcluidas = progress.historiasConcluidas.filter(id => id !== 'teste_sync');
      await saveUserProgress(progress);
      console.log('✅ Dados de teste removidos');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
    return false;
  }
};
