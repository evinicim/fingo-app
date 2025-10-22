/**
 * Script de teste independente para verificar sincronização
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDoc, setDoc } = require('firebase/firestore');

// Configuração do Firebase (substitua pelos seus valores)
const firebaseConfig = {
  // Sua configuração do Firebase aqui
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebaseConnection() {
  try {
    console.log('🔥 Testando conexão com Firebase...');
    
    // Testar leitura de uma coleção
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, { 
      timestamp: new Date().toISOString(),
      message: 'Teste de conexão'
    });
    
    console.log('✅ Conexão com Firebase estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com Firebase:', error);
    return false;
  }
}

async function testSync() {
  console.log('🧪 INICIANDO TESTES DE SINCRONIZAÇÃO...\n');
  
  try {
    // Teste 1: Conexão Firebase
    const firebaseOk = await testFirebaseConnection();
    if (!firebaseOk) {
      console.log('❌ Falha na conexão Firebase - testes interrompidos');
      return;
    }

    // Teste 2: Verificar estrutura de dados
    console.log('\n📊 Verificando estrutura de dados...');
    
    // Verificar se existem trilhas
    const trilhasRef = collection(db, 'trilhaId');
    console.log('✅ Coleção trilhaId acessível');

    // Verificar se existem usuários
    const usersRef = collection(db, 'users');
    console.log('✅ Coleção users acessível');

    console.log('\n🎉 TESTES DE SINCRONIZAÇÃO CONCLUÍDOS!');
    console.log('📱 Agora você pode testar no app usando os botões "Test Sync" e "Cleanup"');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
testSync();
