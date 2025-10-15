/**
 * ============================================
 * SERVIÇO DE CACHE - cacheService.js
 * ============================================
 * 
 * Sistema de cache em duas camadas para otimizar performance da aplicação FinGo.
 * Implementa cache em memória (rápido) e cache persistente (AsyncStorage).
 * 
 * Funcionalidades:
 * - Cache em memória para acesso instantâneo
 * - Cache persistente para dados entre sessões
 * - Invalidação automática por tempo
 * - Pré-carregamento de dados essenciais
 * - Cache específico por usuário
 * 
 * @author Equipe FinGo
 * @version 1.0.0
 */

// Serviço de cache para otimizar carregamento
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Duração padrão do cache em milissegundos (5 minutos)
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

/**
 * Cache em memória para acesso instantâneo aos dados
 * Mais rápido que AsyncStorage, mas perdido ao fechar o app
 */
// Cache em memória (mais rápido que AsyncStorage)
const memoryCache = new Map();

/**
 * Gera chave única de cache baseada na chave e ID do usuário
 * @param {string} key - Chave base do cache
 * @param {string|null} userId - ID do usuário (opcional)
 * @returns {string} Chave única de cache
 */
// Gerar chave de cache
const getCacheKey = (key, userId = null) => {
  return userId ? `cache_${userId}_${key}` : `cache_${key}`;
};

/**
 * Salva dados no cache (memória + AsyncStorage)
 * @param {string} key - Chave do cache
 * @param {any} data - Dados a serem salvos
 * @param {string|null} userId - ID do usuário (opcional)
 */
// Salvar no cache (memória + AsyncStorage)
export const setCache = async (key, data, userId = null) => {
  try {
    const cacheKey = getCacheKey(key, userId);
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    
    // Cache em memória (instantâneo)
    memoryCache.set(cacheKey, cacheData);
    
    // Cache persistente (AsyncStorage)
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
};

/**
 * Busca dados do cache (memória primeiro, depois AsyncStorage)
 * @param {string} key - Chave do cache
 * @param {string|null} userId - ID do usuário (opcional)
 * @param {number} maxAge - Idade máxima do cache em ms (opcional)
 * @returns {any|null} Dados do cache ou null se não encontrado/expirado
 */
// Buscar do cache
export const getCache = async (key, userId = null, maxAge = CACHE_DURATION) => {
  try {
    const cacheKey = getCacheKey(key, userId);
    
    // Tentar buscar da memória primeiro (mais rápido)
    let cached = memoryCache.get(cacheKey);
    
    // Se não estiver na memória, buscar do AsyncStorage
    if (!cached) {
      const cachedStr = await AsyncStorage.getItem(cacheKey);
      if (cachedStr) {
        cached = JSON.parse(cachedStr);
        // Repovoar memória
        memoryCache.set(cacheKey, cached);
      }
    }
    
    if (!cached) return null;
    
    // Verificar se o cache ainda é válido
    const age = Date.now() - cached.timestamp;
    if (age > maxAge) {
      // Cache expirado
      memoryCache.delete(cacheKey);
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }
    
    return cached.data;
  } catch (error) {
    console.error('Erro ao buscar cache:', error);
    return null;
  }
};

/**
 * Invalida cache específico (remove da memória e AsyncStorage)
 * @param {string} key - Chave do cache a ser invalidada
 * @param {string|null} userId - ID do usuário (opcional)
 */
// Invalidar cache específico
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
 * Limpa todo o cache (útil no logout)
 * @param {string|null} userId - ID do usuário (opcional)
 */
// Limpar todo o cache (útil no logout)
export const clearAllCache = async (userId = null) => {
  try {
    if (userId) {
      // Limpar cache específico do usuário
      const keys = await AsyncStorage.getAllKeys();
      const userCacheKeys = keys.filter(k => k.startsWith(`cache_${userId}_`));
      await AsyncStorage.multiRemove(userCacheKeys);
      // Limpar memória
      for (const [key] of memoryCache) {
        if (key.startsWith(`cache_${userId}_`)) {
          memoryCache.delete(key);
        }
      }
    } else {
      // Limpar todo cache
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
 * Pré-carrega dados essenciais em background após login
 * Melhora performance carregando dados importantes antecipadamente
 * @param {string} userId - ID do usuário logado
 */
// Pré-carregar dados essenciais (rodar no login)
export const preloadEssentialData = async (userId) => {
  try {
    console.log('🚀 Pré-carregando dados essenciais...');
    // Importar services aqui para evitar dependência circular
    const { getTrilhas } = require('./contentService');
    const { buscarDadosPerfil } = require('./userService');
    const { getUserStats } = require('./progressService');
    
    // Carregar em paralelo
    const [trilhas, perfil, stats] = await Promise.all([
      getTrilhas(),
      buscarDadosPerfil(userId),
      getUserStats(),
    ]);
    
    // Salvar no cache
    await Promise.all([
      setCache('trilhas', trilhas),
      setCache('perfil', perfil.success ? perfil.data : null, userId),
      setCache('stats', stats, userId),
    ]);
    
    console.log('✅ Dados essenciais pré-carregados!');
    return true;
  } catch (error) {
    console.error('Erro ao pré-carregar dados:', error);
    return false;
  }
};

