/**
 * Configuração e inicialização do Firebase
 * 
 * Este arquivo configura todas as conexões com os serviços do Firebase:
 * - Authentication: para login e registro de usuários
 * - Firestore: banco de dados NoSQL para armazenar dados do app
 * - Storage: para armazenar arquivos (imagens, vídeos, etc)
 * 
 * Usamos variáveis de ambiente para manter as credenciais seguras.
 */

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Configuro as credenciais do Firebase usando variáveis de ambiente
// Isso mantém as chaves seguras e não as expõe no código
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicializo a aplicação Firebase com as configurações acima
const app = initializeApp(firebaseConfig);

// Configuro o Authentication com persistência local
// Isso significa que o usuário permanece logado mesmo após fechar o app
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializo o Firestore, que é nosso banco de dados
// Usamos ele para armazenar trilhas, questões, progresso dos usuários, etc
export const db = getFirestore(app);

// Inicializo o Storage, caso precisemos armazenar arquivos
// Por enquanto não usamos muito, mas está disponível se precisar
export const storage = getStorage(app);
