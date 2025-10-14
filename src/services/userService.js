import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Função para salvar dados do perfil do usuário
export const salvarDadosPerfil = async (userId, dadosPerfil) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Dados básicos do perfil
    const perfilData = {
      ...dadosPerfil,
      dataAtualizacao: new Date().toISOString(),
      perfilCompleto: true,
    };

    // Salvar ou atualizar o documento do usuário
    await setDoc(userRef, perfilData, { merge: true });
    
    console.log('✅ Dados do perfil salvos com sucesso:', perfilData);
    return { success: true, data: perfilData };
    
  } catch (error) {
    console.error('❌ Erro ao salvar dados do perfil:', error);
    return { success: false, error: error.message };
  }
};

// Função para buscar dados do perfil do usuário
export const buscarDadosPerfil = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log('✅ Dados do perfil carregados:', userData);
      return { success: true, data: userData };
    } else {
      console.log('⚠️ Usuário não encontrado no Firestore');
      return { success: false, error: 'Usuário não encontrado' };
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados do perfil:', error);
    return { success: false, error: error.message };
  }
};

// Função para atualizar dados específicos do perfil
export const atualizarDadosPerfil = async (userId, novosDados) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const dadosAtualizados = {
      ...novosDados,
      dataAtualizacao: new Date().toISOString(),
    };

    await updateDoc(userRef, dadosAtualizados);
    
    console.log('✅ Dados do perfil atualizados:', dadosAtualizados);
    return { success: true, data: dadosAtualizados };
    
  } catch (error) {
    console.error('❌ Erro ao atualizar dados do perfil:', error);
    return { success: false, error: error.message };
  }
};

// Função para verificar se o perfil está completo
export const verificarPerfilCompleto = async (userId) => {
  try {
    const result = await buscarDadosPerfil(userId);
    
    if (result.success) {
      const { avatar, idade, nivelConhecimento } = result.data;
      const perfilCompleto = !!(avatar && idade && nivelConhecimento);
      
      return { 
        success: true, 
        perfilCompleto,
        dados: result.data 
      };
    }
    
    return { success: false, perfilCompleto: false };
    
  } catch (error) {
    console.error('❌ Erro ao verificar perfil completo:', error);
    return { success: false, perfilCompleto: false };
  }
};

// Função para criar estrutura inicial do usuário
export const criarUsuarioInicial = async (userId, email, nome) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const dadosIniciais = {
      email: email,
      nome: nome,
      dataCriacao: new Date().toISOString(),
      perfilCompleto: false,
      avatar: null,
      idade: null,
      nivelConhecimento: null,
      // Dados de progresso
      trilhasConcluidas: [],
      questoesCompletadas: [],
      pontuacaoTotal: 0,
      nivel: 1,
      xp: 0,
    };

    await setDoc(userRef, dadosIniciais);
    
    console.log('✅ Usuário inicial criado:', dadosIniciais);
    return { success: true, data: dadosIniciais };
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário inicial:', error);
    return { success: false, error: error.message };
  }
};

// Função para excluir conta do usuário
export const excluirConta = async (userId) => {
  try {
    // Excluir documento do Firestore
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    
    console.log('✅ Dados do usuário excluídos do Firestore');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erro ao excluir dados do usuário:', error);
    return { success: false, error: error.message };
  }
};
