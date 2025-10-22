/**
 * Script para popular o Firebase com dados de teste
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Configuração do Firebase (use as mesmas variáveis de ambiente)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function populateFAQ() {
  console.log('📝 Populando FAQ...');
  
  const faqData = [
    {
      id: 'faq_1',
      question: "Como eu posso trocar a minha senha?",
      answer: "Você pode trocar a sua senha na página de configurações do perfil. A opção para redefinir a senha estará disponível no menu.",
      ordem: 1
    },
    {
      id: 'faq_2',
      question: "O que é educação financeira gamificada?",
      answer: "É uma metodologia que usa elementos de jogos para ensinar conceitos financeiros de forma divertida e interativa, ajudando você a aprender sobre dinheiro de um jeito novo.",
      ordem: 2
    },
    {
      id: 'faq_3',
      question: "Posso usar o aplicativo offline?",
      answer: "O aplicativo precisa de conexão com a internet para carregar os conteúdos e sincronizar seu progresso. No entanto, algumas atividades podem ser acessadas offline.",
      ordem: 3
    },
    {
      id: 'faq_4',
      question: "Como funciona o sistema de XP?",
      answer: "Você ganha XP completando questões e histórias. Quanto mais XP você acumula, maior seu nível e mais recursos você desbloqueia!",
      ordem: 4
    },
    {
      id: 'faq_5',
      question: "Posso usar o app em mais de um dispositivo?",
      answer: "Sim! Seu progresso é sincronizado automaticamente entre todos os seus dispositivos quando você faz login com a mesma conta.",
      ordem: 5
    }
  ];

  for (const faq of faqData) {
    await setDoc(doc(db, 'faq', faq.id), faq);
    console.log(`✅ FAQ ${faq.id} adicionado`);
  }
}

async function populateAvatares() {
  console.log('👤 Populando avatares...');
  
  const avataresData = [
    { id: '1', icon: '👦', name: 'João', descricao: 'Aventureiro corajoso' },
    { id: '2', icon: '👧', name: 'Maria', descricao: 'Exploradora inteligente' },
    { id: '3', icon: '🧑', name: 'Alex', descricao: 'Estrategista criativo' },
    { id: '4', icon: '👩', name: 'Ana', descricao: 'Líder inspiradora' },
    { id: '5', icon: '👨', name: 'Carlos', descricao: 'Pensador analítico' },
    { id: '6', icon: '👩‍🦱', name: 'Sofia', descricao: 'Inovadora visionária' },
    { id: '7', icon: '🧑‍🦱', name: 'Pedro', descricao: 'Detetive financeiro' },
    { id: '8', icon: '👩‍🦰', name: 'Lara', descricao: 'Matemática genial' }
  ];

  for (const avatar of avataresData) {
    await setDoc(doc(db, 'avatares', avatar.id), avatar);
    console.log(`✅ Avatar ${avatar.name} adicionado`);
  }
}

async function populateNiveisConhecimento() {
  console.log('📚 Populando níveis de conhecimento...');
  
  const niveisData = [
    {
      id: 'iniciante',
      label: 'Iniciante',
      description: 'Estou começando a aprender sobre finanças',
      icon: '🌱',
      cor: '#4CAF50',
      requisitos: 'Nenhum requisito'
    },
    {
      id: 'intermediario',
      label: 'Intermediário',
      description: 'Já tenho algumas noções básicas',
      icon: '📈',
      cor: '#FF9800',
      requisitos: 'Completar 3 trilhas'
    },
    {
      id: 'avancado',
      label: 'Avançado',
      description: 'Tenho conhecimento sólido em finanças',
      icon: '💎',
      cor: '#9C27B0',
      requisitos: 'Completar 6 trilhas'
    }
  ];

  for (const nivel of niveisData) {
    await setDoc(doc(db, 'niveisConhecimento', nivel.id), nivel);
    console.log(`✅ Nível ${nivel.label} adicionado`);
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando população do Firebase com dados de teste...\n');
    
    await populateFAQ();
    console.log('');
    
    await populateAvatares();
    console.log('');
    
    await populateNiveisConhecimento();
    console.log('');
    
    console.log('🎉 Todos os dados de teste foram adicionados ao Firebase!');
    console.log('\n📊 Resumo:');
    console.log('- 5 FAQs adicionados');
    console.log('- 8 Avatares adicionados');
    console.log('- 3 Níveis de conhecimento adicionados');
    
  } catch (error) {
    console.error('❌ Erro ao popular Firebase:', error);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { populateFAQ, populateAvatares, populateNiveisConhecimento };
