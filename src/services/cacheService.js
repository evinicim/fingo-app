/**
 * Serviço de cache para otimizar o carregamento de dados
 * 
 * Este serviço implementa um sistema de cache em duas camadas:
 * 1. Cache em memória (Map) - muito rápido, mas se perde ao fechar o app
 * 2. Cache persistente (AsyncStorage) - mais lento, mas sobrevive ao fechar o app
 * 
 * Isso melhora muito a performance, evitando buscar dados do Firestore toda vez.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Duração padrão do cache: 5 minutos
// Após esse tempo, os dados são considerados expirados e precisam ser atualizados
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

// Cache em memória (Map) - muito mais rápido que AsyncStorage
// Os dados ficam na RAM enquanto o app está aberto
const memoryCache = new Map();

/**
 * Gero uma chave única para o cache
 * 
 * Se tiver userId, incluo ele na chave para evitar conflitos
 * entre dados de diferentes usuários.
 * 
 * @param {string} key - Chave base do cache
 * @param {string|null} userId - ID do usuário (opcional)
 * @returns {string} - Chave completa do cache
 */
const getCacheKey = (key, userId = null) => {
  return userId ? `cache_${userId}_${key}` : `cache_${key}`;
};

/**
 * Salvo dados no cache (tanto em memória quanto no AsyncStorage)
 * 
 * Salvo em dois lugares:
 * - Memória: para acesso instantâneo enquanto o app está aberto
 * - AsyncStorage: para persistir mesmo após fechar o app
 * 
 * @param {string} key - Chave do cache
 * @param {any} data - Dados para salvar
 * @param {string|null} userId - ID do usuário (opcional)
 */
export const setCache = async (key, data, userId = null) => {
  try {
    const cacheKey = getCacheKey(key, userId);
    const cacheData = {
      data,
      timestamp: Date.now(), // Salvo quando foi criado para verificar expiração depois
    };
    
    // Salvo na memória primeiro (é instantâneo)
    memoryCache.set(cacheKey, cacheData);
    
    // Depois salvo no AsyncStorage (é mais lento, mas persiste)
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
};

/**
 * Busco dados do cache
 * 
 * Primeiro tento buscar da memória (mais rápido). Se não encontrar,
 * busco do AsyncStorage. Se encontrar no AsyncStorage, repovo a memória
 * para próximas buscas serem mais rápidas.
 * 
 * Também verifico se o cache não expirou. Se expirou, removo e retorno null.
 * 
 * @param {string} key - Chave do cache
 * @param {string|null} userId - ID do usuário (opcional)
 * @param {number} maxAge - Idade máxima do cache em milissegundos (padrão: 5 minutos)
 * @returns {any|null} - Dados do cache ou null se não encontrar/expirado
 */
export const getCache = async (key, userId = null, maxAge = CACHE_DURATION) => {
  try {
    const cacheKey = getCacheKey(key, userId);
    
    // Primeiro tento buscar da memória (é muito mais rápido)
    let cached = memoryCache.get(cacheKey);
    
    // Se não estiver na memória, busco do AsyncStorage
    if (!cached) {
      const cachedStr = await AsyncStorage.getItem(cacheKey);
      if (cachedStr) {
        cached = JSON.parse(cachedStr);
        // Repovo a memória para próximas buscas serem mais rápidas
        memoryCache.set(cacheKey, cached);
      }
    }
    
    // Se não encontrei em nenhum lugar, retorno null
    if (!cached) return null;
    
    // Verifico se o cache ainda é válido (não expirou)
    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      // Cache expirado, removo de ambos os lugares
      memoryCache.delete(cacheKey);
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }
    
    // Cache válido, retorno os dados
    return cached.data;
  } catch (error) {
    console.error('Erro ao buscar cache:', error);
    return null;
  }
};

/**
 * Invalido um cache específico (forço atualização na próxima busca)
 * 
 * Removo o cache tanto da memória quanto do AsyncStorage.
 * Na próxima vez que buscar esse dado, vai buscar do Firestore novamente.
 * 
 * @param {string} key - Chave do cache
 * @param {string|null} userId - ID do usuário (opcional)
 */
export const invalidateCache = async (key, userId = null) => {
  try {
    const cacheKey = getCacheKey(key, userId);
    memoryCache.delete(cacheKey);
    await AsyncStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Erro ao invalidar cache:', error);
  }
};

/**
 * Limpo todo o cache (útil quando o usuário faz logout)
 * 
 * Se passar userId, limpo apenas o cache daquele usuário.
 * Se não passar, limpo todo o cache do app.
 * 
 * @param {string|null} userId - ID do usuário (opcional)
 */
export const clearAllCache = async (userId = null) => {
  try {
    if (userId) {
      // Limpo apenas o cache específico deste usuário
      const keys = await AsyncStorage.getAllKeys();
      const userCacheKeys = keys.filter(k => k.startsWith(`cache_${userId}_`));
      await AsyncStorage.multiRemove(userCacheKeys);
      // Limpo também da memória
      for (const [key] of memoryCache) {
        if (key.startsWith(`cache_${userId}_`)) {
          memoryCache.delete(key);
        }
      }
    } else {
      // Limpo todo o cache do app
      memoryCache.clear();
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

/**
 * Pré-carrego dados essenciais quando o usuário faz login
 * 
 * Carrego trilhas, perfil e estatísticas em paralelo e salvo no cache.
 * Isso faz o app ficar mais rápido depois, pois os dados já estarão em cache.
 * 
 * @param {string} userId - ID do usuário
 * @returns {boolean} - true se conseguiu pré-carregar, false se deu erro
 */
export const preloadEssentialData = async (userId) => {
  try {
    // ENDPOINT: Pré-carregamento de dados (teste de performance)
    // console.log('🚀 Pré-carregando dados essenciais...');
    // Importo os services aqui para evitar dependência circular
    const { getTrilhas } = require('./contentService');
    const { buscarDadosPerfil } = require('./userService');
    const { getUserStats } = require('./progressService');
    
    // Carrego tudo em paralelo (mais rápido que sequencial)
    const [trilhas, perfil, stats] = await Promise.all([
      getTrilhas(),
      buscarDadosPerfil(userId),
      getUserStats(),
    ]);
    
    // Salvo tudo no cache para acesso rápido depois
    await Promise.all([
      setCache('trilhas', trilhas),
      setCache('perfil', perfil.success ? perfil.data : null, userId),
      setCache('stats', stats, userId),
    ]);
    
    // ENDPOINT: Pré-carregamento concluído
    // console.log('✅ Dados essenciais pré-carregados!');
    return true;
  } catch (error) {
    // Mantido para debug de problemas de pré-carregamento
    console.error('Erro ao pré-carregar dados:', error);
    return false;
  }
};

