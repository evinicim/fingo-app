import { initializeApp } from 'firebase/app';
// Adicione os serviços que for usar, ex: getAuth, getFirestore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase do seu projeto web
// NUNCA coloque as chaves diretamente aqui. Use variáveis de ambiente!
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporte os serviços que você inicializou para usar no resto do app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);