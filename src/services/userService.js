/**
 * Serviço para gerenciar dados do perfil do usuário
 * 
 * Este arquivo contém todas as funções que lidam com informações do perfil:
 * - Salvar dados do perfil (nome, avatar, idade, nível de conhecimento)
 * - Buscar dados do perfil
 * - Atualizar dados específicos
 * - Verificar se o perfil está completo
 * - Criar usuário inicial quando ele se cadastra
 * - Excluir conta do usuário
 */

import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Salvo os dados completos do perfil do usuário no Firestore
 * 
 * @param {string} userId - ID do usuário no Firebase Auth
 * @param {object} dadosPerfil - Objeto com os dados do perfil (nome, avatar, idade, nivelConhecimento)
 * @returns {object} - { success: boolean, data?: object, error?: string }
 */
export const salvarDadosPerfil = async (userId, dadosPerfil) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Se o nome não vier nos dados, busco o nome atual do usuário no Firestore
    let nomeCompleto = dadosPerfil.nome;
    if (!nomeCompleto) {
      const userSnap = await getDoc(userRef);
      nomeCompleto = userSnap.data()?.nome || '';
    }
    
    // Separo o nome completo em primeiro nome e sobrenome
    // Isso facilita exibir apenas o primeiro nome em algumas telas
    const primeiroNome = nomeCompleto?.split(' ')[0] || '';
    const sobrenome = nomeCompleto?.split(' ').slice(1).join(' ') || '';
    
    // Normalizo o avatar para garantir que sempre seja apenas o ID (número)
    // Às vezes pode vir como objeto { id: 1 }, então extraio só o ID
    let avatarNormalizado = dadosPerfil.avatar;
    if (avatarNormalizado) {
      if (typeof avatarNormalizado === 'object' && avatarNormalizado.id) {
        // Se vier como objeto, pego apenas o ID
        avatarNormalizado = avatarNormalizado.id;
      } else if (typeof avatarNormalizado === 'string') {
        // Se for string (emoji antigo de versões anteriores), mantenho como está
        // Isso garante compatibilidade com dados antigos
      }
      // Se já for número, mantenho como está
    }
    
    // Monto o objeto completo com todos os dados do perfil
    const perfilData = {
      ...dadosPerfil,
      avatar: avatarNormalizado, // Uso o avatar normalizado
      ...(nomeCompleto && { nome: nomeCompleto }),
      primeiroNome,
      sobrenome,
      dataAtualizacao: new Date().toISOString(),
      perfilCompleto: true, // Marco como completo quando salvo todos os dados
    };

    // Salvo ou atualizo o documento do usuário no Firestore
    // O merge: true garante que não sobrescrevo dados existentes
    await setDoc(userRef, perfilData, { merge: true });
    
    // ENDPOINT: Dados do perfil salvos com sucesso
    // console.log('✅ Dados do perfil salvos com sucesso:', perfilData);
    return { success: true, data: perfilData };
    
  } catch (error) {
    console.error('❌ Erro ao salvar dados do perfil:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Busco os dados do perfil do usuário no Firestore
 * 
 * @param {string} userId - ID do usuário no Firebase Auth
 * @returns {object} - { success: boolean, data?: object, error?: string }
 */
export const buscarDadosPerfil = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      // Se o avatar estiver salvo como objeto, converto para apenas o ID
      // Isso corrige dados antigos e evita problemas futuros
      if (userData.avatar && typeof userData.avatar === 'object' && userData.avatar.id) {
        userData.avatar = userData.avatar.id;
        // Atualizo no Firestore para corrigir o dado permanentemente
        await updateDoc(userRef, { avatar: userData.avatar });
      }
      
      // ENDPOINT: Dados do perfil carregados
      // console.log('✅ Dados do perfil carregados:', userData);
      return { success: true, data: userData };
    } else {
      // ENDPOINT: Usuário não encontrado
      // console.log('⚠️ Usuário não encontrado no Firestore');
      return { success: false, error: 'Usuário não encontrado' };
    }
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados do perfil:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Atualizo apenas campos específicos do perfil do usuário
 * 
 * Diferente de salvarDadosPerfil, esta função atualiza apenas os campos que vierem
 * em novosDados, sem sobrescrever o resto. Útil para atualizar apenas o avatar, por exemplo.
 * 
 * @param {string} userId - ID do usuário no Firebase Auth
 * @param {object} novosDados - Objeto com apenas os campos que quero atualizar
 * @returns {object} - { success: boolean, data?: object, error?: string }
 */
export const atualizarDadosPerfil = async (userId, novosDados) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Normalizo o avatar se ele estiver sendo atualizado
    // Garanto que sempre seja apenas o ID (número), não um objeto
    let avatarNormalizado = novosDados.avatar;
    if (avatarNormalizado !== undefined && avatarNormalizado !== null) {
      if (typeof avatarNormalizado === 'object' && avatarNormalizado.id) {
        // Se vier como objeto, pego apenas o ID
        avatarNormalizado = avatarNormalizado.id;
      }
      // Se já for número ou string, mantenho como está
    }
    
    // Monto o objeto com os dados atualizados
    const dadosAtualizados = {
      ...novosDados,
      ...(avatarNormalizado !== undefined && { avatar: avatarNormalizado }),
      dataAtualizacao: new Date().toISOString(), // Sempre atualizo a data de modificação
    };

    // Atualizo apenas os campos especificados no Firestore
    await updateDoc(userRef, dadosAtualizados);
    
    // ENDPOINT: Dados do perfil atualizados
    // console.log('✅ Dados do perfil atualizados:', dadosAtualizados);
    return { success: true, data: dadosAtualizados };
    
  } catch (error) {
    console.error('❌ Erro ao atualizar dados do perfil:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verifico se o perfil do usuário está completo
 * 
 * Um perfil está completo quando tem:
 * - Avatar selecionado
 * - Idade informada
 * - Nível de conhecimento informado
 * 
 * @param {string} userId - ID do usuário no Firebase Auth
 * @returns {object} - { success: boolean, perfilCompleto: boolean, dados?: object }
 */
export const verificarPerfilCompleto = async (userId) => {
  try {
    const result = await buscarDadosPerfil(userId);
    
    if (result.success) {
      // Verifico se todos os campos obrigatórios estão preenchidos
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

/**
 * Crio a estrutura inicial do usuário quando ele se cadastra
 * 
 * Quando um novo usuário se registra, preciso criar:
 * - Documento no Firestore com dados básicos
 * - Estrutura de progresso limpa (sem trilhas ou questões concluídas)
 * - Cache local no AsyncStorage
 * 
 * @param {string} userId - ID do usuário no Firebase Auth
 * @param {string} email - Email do usuário
 * @param {string} nome - Nome completo do usuário
 * @returns {object} - { success: boolean, data?: object, error?: string }
 */
export const criarUsuarioInicial = async (userId, email, nome) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Defino os dados iniciais do usuário
    // Todos começam zerados: sem avatar, sem progresso, perfil incompleto
    const dadosIniciais = {
      email: email,
      nome: nome,
      primeiroNome: nome?.split(' ')[0] || '',
      sobrenome: nome?.split(' ').slice(1).join(' ') || '',
      dataCriacao: new Date().toISOString(),
      perfilCompleto: false, // Perfil ainda não está completo
      avatar: null,
      idade: null,
      nivelConhecimento: null,
      termosAceitos: false,
      dataAceiteTermos: null,
      // Dados de progresso inicializados como vazios
      trilhasConcluidas: [],
      questoesCompletadas: [],
      pontuacaoTotal: 0,
      nivel: 1, // Todo mundo começa no nível 1
      xp: 0, // Sem experiência ainda
    };

    // Crio o documento do usuário no Firestore
    await setDoc(userRef, dadosIniciais);
    
    // Inicializo o progresso limpo tanto no AsyncStorage quanto no Firestore
    // Isso garante que novos usuários não herdem dados de outros usuários
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const { doc, setDoc } = require('firebase/firestore');
      const { db } = require('./firebaseConfig');
      
      const progressKey = `user_progress_${userId}`;
      const cleanProgress = {
        historiasConcluidas: [],
        questoesCompletadas: [],
        trilhasProgresso: {},
        userId: userId, // Sempre incluo o userId para validação
        ultimaAtualizacao: new Date().toISOString()
      };
      
      // Salvo localmente no AsyncStorage para acesso rápido
      await AsyncStorage.setItem(progressKey, JSON.stringify(cleanProgress));
      
      // Salvo também no Firestore para persistência na nuvem
      const progressRef = doc(db, 'users', userId);
      await setDoc(progressRef, { 
        progressoCache: cleanProgress,
        historiasConcluidas: [],
        questoesCompletadas: [],
        trilhasProgresso: {},
        dataCriacaoProgresso: new Date().toISOString()
      }, { merge: true });
      
      // ENDPOINT: Progresso inicializado para novo usuário
      // console.log('✅ Progresso inicializado no AsyncStorage e Firestore para novo usuário');
    } catch (err) {
      // Mantido para debug de problemas de inicialização
      console.warn('⚠️ Erro ao inicializar progresso:', err);
    }
    

    // ENDPOINT: Usuário inicial criado
    // console.log('✅ Usuário inicial criado:', dadosIniciais);
    return { success: true, data: dadosIniciais };
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário inicial:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Excluo a conta do usuário do Firestore
 * 
 * ATENÇÃO: Esta função apenas exclui os dados do Firestore.
 * Para excluir completamente a conta, também é necessário excluir
 * a autenticação no Firebase Auth (isso deve ser feito na tela de configurações).
 * 
 * @param {string} userId - ID do usuário no Firebase Auth
 * @returns {object} - { success: boolean, error?: string }
 */
export const excluirConta = async (userId) => {
  try {
    // Excluo o documento do usuário no Firestore
    // Isso remove todos os dados: perfil, progresso, etc
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    
    // ENDPOINT: Dados do usuário excluídos
    // console.log('✅ Dados do usuário excluídos do Firestore');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erro ao excluir dados do usuário:', error);
    return { success: false, error: error.message };
  }
};
