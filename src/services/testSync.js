/**
 * Script de teste para verificar sincronização Firebase vs AsyncStorage
 */

import { loadUserProgress, saveUserProgress } from './progressService';
import { syncFromFirebase, syncToFirebase, checkSyncConflicts, forceSync } from './syncService';
import { auth } from './firebaseConfig';

export const testSync = async () => {
  console.log('🧪 INICIANDO TESTES DE SINCRONIZAÇÃO...\n');

  try {
    // Teste 1: Verificar se usuário está logado
    console.log('1️⃣ Verificando autenticação...');
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ Usuário não logado - alguns testes serão limitados');
    } else {
      console.log(`✅ Usuário logado: ${user.email}`);
    }

    // Teste 2: Carregar progresso atual
    console.log('\n2️⃣ Carregando progresso atual...');
    const currentProgress = await loadUserProgress();
    console.log('📊 Progresso atual:', {
      historiasConcluidas: currentProgress.historiasConcluidas?.length || 0,
      questoesCompletadas: currentProgress.questoesCompletadas?.length || 0,
      trilhasProgresso: Object.keys(currentProgress.trilhasProgresso || {}).length,
      ultimaAtualizacao: currentProgress.ultimaAtualizacao
    });

    // Teste 3: Verificar conflitos de sincronização
    console.log('\n3️⃣ Verificando conflitos de sincronização...');
    const conflicts = await checkSyncConflicts();
    if (conflicts) {
      if (conflicts.conflict) {
        console.log('⚠️ Conflito detectado:', {
          local: conflicts.local?.ultimaAtualizacao,
          firebase: conflicts.firebase?.ultimaAtualizacao,
          newer: conflicts.newer
        });
      } else {
        console.log('📱 Dados apenas locais:', conflicts.source);
      }
    } else {
      console.log('✅ Nenhum conflito detectado');
    }

    // Teste 4: Sincronizar do Firebase
    console.log('\n4️⃣ Testando sincronização do Firebase...');
    const firebaseProgress = await syncFromFirebase();
    if (firebaseProgress) {
      console.log('✅ Sincronização do Firebase bem-sucedida');
      console.log('📊 Dados do Firebase:', {
        historiasConcluidas: firebaseProgress.historiasConcluidas?.length || 0,
        questoesCompletadas: firebaseProgress.questoesCompletadas?.length || 0,
        sincronizado: firebaseProgress.sincronizado
      });
    } else {
      console.log('⚠️ Nenhum progresso encontrado no Firebase');
    }

    // Teste 5: Simular atualização de progresso
    console.log('\n5️⃣ Testando salvamento de progresso...');
    const testProgress = {
      ...currentProgress,
      historiasConcluidas: [...(currentProgress.historiasConcluidas || []), 'teste_sync'],
      ultimaAtualizacao: new Date().toISOString()
    };

    const saveResult = await saveUserProgress(testProgress);
    if (saveResult) {
      console.log('✅ Progresso salvo com sucesso');
    } else {
      console.log('❌ Falha ao salvar progresso');
    }

    // Teste 6: Sincronização forçada
    console.log('\n6️⃣ Testando sincronização forçada...');
    const forceSyncResult = await forceSync();
    if (forceSyncResult) {
      console.log('✅ Sincronização forçada bem-sucedida');
    } else {
      console.log('⚠️ Sincronização forçada falhou');
    }

    // Teste 7: Verificar estado final
    console.log('\n7️⃣ Verificando estado final...');
    const finalProgress = await loadUserProgress();
    console.log('📊 Estado final:', {
      historiasConcluidas: finalProgress.historiasConcluidas?.length || 0,
      questoesCompletadas: finalProgress.questoesCompletadas?.length || 0,
      trilhasProgresso: Object.keys(finalProgress.trilhasProgresso || {}).length,
      ultimaAtualizacao: finalProgress.ultimaAtualizacao,
      sincronizado: finalProgress.sincronizado
    });

    console.log('\n🎉 TESTES DE SINCRONIZAÇÃO CONCLUÍDOS!');

    return {
      success: true,
      initialProgress: currentProgress,
      finalProgress: finalProgress,
      conflicts: conflicts,
      firebaseSync: firebaseProgress !== null,
      forceSync: forceSyncResult !== null
    };

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Função para limpar dados de teste
export const cleanupTestData = async () => {
  try {
    console.log('🧹 Limpando dados de teste...');
    const progress = await loadUserProgress();
    
    // Remover dados de teste
    if (progress.historiasConcluidas?.includes('teste_sync')) {
      progress.historiasConcluidas = progress.historiasConcluidas.filter(id => id !== 'teste_sync');
      await saveUserProgress(progress);
      console.log('✅ Dados de teste removidos');
    }
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
  }
};
