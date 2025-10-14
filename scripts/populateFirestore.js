/**
 * Script para popular o Firestore com dados iniciais
 * Execute: node scripts/populateFirestore.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// DADOS: TRILHAS
// ============================================
const trilhas = [
  {
    id: 'trilha_01',
    titulo: 'Fundamentos Financeiros',
    descricao: 'Aprenda os conceitos básicos de educação financeira',
    ordem: 1,
    icone: '💰',
    cor: '#4CAF50',
    totalModulos: 4,
    totalQuestoes: 10,
    pontosTotal: 500,
    duracao: 45,
    prerequisitos: [],
    ativa: true,
  },
  {
    id: 'trilha_02',
    titulo: 'Poupança e Investimentos',
    descricao: 'Descubra como poupar e investir seu dinheiro',
    ordem: 2,
    icone: '📈',
    cor: '#2196F3',
    totalModulos: 4,
    totalQuestoes: 12,
    pontosTotal: 600,
    duracao: 50,
    prerequisitos: ['trilha_01'],
    ativa: true,
  },
  {
    id: 'trilha_03',
    titulo: 'Planejamento Financeiro',
    descricao: 'Aprenda a planejar suas finanças pessoais',
    ordem: 3,
    icone: '📊',
    cor: '#FF9800',
    totalModulos: 4,
    totalQuestoes: 15,
    pontosTotal: 700,
    duracao: 60,
    prerequisitos: ['trilha_02'],
    ativa: true,
  },
  {
    id: 'trilha_04',
    titulo: 'Empreendedorismo',
    descricao: 'Desenvolva habilidades empreendedoras',
    ordem: 4,
    icone: '🚀',
    cor: '#9C27B0',
    totalModulos: 5,
    totalQuestoes: 18,
    pontosTotal: 800,
    duracao: 70,
    prerequisitos: ['trilha_03'],
    ativa: true,
  },
  {
    id: 'trilha_05',
    titulo: 'Finanças Avançadas',
    descricao: 'Tópicos avançados de educação financeira',
    ordem: 5,
    icone: '🎓',
    cor: '#F44336',
    totalModulos: 5,
    totalQuestoes: 20,
    pontosTotal: 1000,
    duracao: 80,
    prerequisitos: ['trilha_04'],
    ativa: true,
  },
];

// ============================================
// DADOS: MÓDULOS
// ============================================
const modulos = [
  // TRILHA 01 - Fundamentos Financeiros
  {
    id: 'trilha_01_modulo_01',
    titulo: 'O Sonho de Maria',
    descricao: 'História introdutória sobre planejamento financeiro e realização de sonhos',
    trilhaId: 'trilha_01',
    ordem: 1,
    tipo: 'historia',
    duracao: 5,
    pontos: 50,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: [],
  },
  {
    id: 'trilha_01_modulo_02',
    titulo: 'O que é Dinheiro?',
    descricao: 'Vídeo explicativo sobre a origem e função do dinheiro na sociedade',
    trilhaId: 'trilha_01',
    ordem: 2,
    tipo: 'video',
    duracao: 8,
    pontos: 75,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_01_modulo_01'],
  },
  {
    id: 'trilha_01_modulo_03',
    titulo: 'Quiz: Conceitos Básicos',
    descricao: 'Teste seus conhecimentos sobre educação financeira básica',
    trilhaId: 'trilha_01',
    ordem: 3,
    tipo: 'quiz',
    duracao: 10,
    pontos: 100,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_01_modulo_02'],
  },
  {
    id: 'trilha_01_modulo_04',
    titulo: 'Desafio: Organize seu Orçamento',
    descricao: 'Crie um orçamento mensal simples e aprenda a controlar seus gastos',
    trilhaId: 'trilha_01',
    ordem: 4,
    tipo: 'desafio',
    duracao: 15,
    pontos: 150,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_01_modulo_03'],
  },

  // TRILHA 02 - Poupança e Investimentos
  {
    id: 'trilha_02_modulo_01',
    titulo: 'A Importância de Poupar',
    descricao: 'História sobre como pequenas economias fazem grande diferença',
    trilhaId: 'trilha_02',
    ordem: 1,
    tipo: 'historia',
    duracao: 6,
    pontos: 60,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: [],
  },
  {
    id: 'trilha_02_modulo_02',
    titulo: 'Tipos de Investimentos',
    descricao: 'Conheça diferentes formas de investir seu dinheiro',
    trilhaId: 'trilha_02',
    ordem: 2,
    tipo: 'video',
    duracao: 10,
    pontos: 80,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_02_modulo_01'],
  },
  {
    id: 'trilha_02_modulo_03',
    titulo: 'Quiz: Poupança e Investimentos',
    descricao: 'Avalie seu conhecimento sobre investimentos',
    trilhaId: 'trilha_02',
    ordem: 3,
    tipo: 'quiz',
    duracao: 12,
    pontos: 120,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_02_modulo_02'],
  },
  {
    id: 'trilha_02_modulo_04',
    titulo: 'Desafio: Simulador de Investimentos',
    descricao: 'Simule diferentes cenários de investimento',
    trilhaId: 'trilha_02',
    ordem: 4,
    tipo: 'desafio',
    duracao: 18,
    pontos: 180,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_02_modulo_03'],
  },
];

// ============================================
// DADOS: HISTÓRIAS
// ============================================
const historias = [
  {
    id: 'historia_trilha_01_modulo_01',
    moduloId: 'trilha_01_modulo_01',
    trilhaId: 'trilha_01',
    titulo: 'O Sonho de Maria',
    conteudo: `Maria sempre sonhou em ter sua própria bicicleta. Todos os dias, ela via seus amigos pedalando pela vizinhança e desejava fazer o mesmo.

Um dia, sua avó lhe deu uma ideia: "Maria, que tal você economizar um pouco do seu dinheiro todo mês? Assim, em breve, você poderá comprar sua bicicleta!"

Maria ficou animada com a ideia. Ela começou a guardar parte da mesada em um cofrinho. No início, parecia que levaria muito tempo, mas ela não desistiu.

Depois de alguns meses, Maria abriu seu cofrinho e contou o dinheiro. Para sua surpresa, ela tinha economizado o suficiente para comprar a bicicleta dos seus sonhos!

Maria aprendeu que com planejamento e paciência, é possível realizar seus sonhos.`,
    personagens: [
      { nome: 'Maria', avatar: '👧' },
      { nome: 'Avó', avatar: '👵' },
    ],
    duracao: 5,
    urlAudio: '',
    imagens: [],
    ordem: 1,
    pontos: 50,
  },
  {
    id: 'historia_trilha_02_modulo_01',
    moduloId: 'trilha_02_modulo_01',
    trilhaId: 'trilha_02',
    titulo: 'A Importância de Poupar',
    conteudo: `João e Pedro eram irmãos gêmeos. Todo mês, eles recebiam a mesma mesada de R$ 50.

João gastava todo o dinheiro comprando doces e brinquedos. Já Pedro guardava R$ 20 e gastava apenas R$ 30.

Depois de um ano, aconteceu algo inesperado: a bicicleta de João quebrou. Ele ficou muito triste porque não tinha dinheiro para consertá-la.

Pedro, que havia economizado durante todo o ano, tinha R$ 240 guardados. Ele ajudou o irmão a consertar a bicicleta e ainda sobrou dinheiro!

João aprendeu uma lição valiosa: poupar dinheiro é importante para enfrentar imprevistos e realizar sonhos.`,
    personagens: [
      { nome: 'João', avatar: '👦' },
      { nome: 'Pedro', avatar: '👦' },
    ],
    duracao: 6,
    urlAudio: '',
    imagens: [],
    ordem: 1,
    pontos: 60,
  },
];

// ============================================
// DADOS: QUESTÕES
// ============================================
const questoes = [
  // Trilha 01 - Módulo 03
  {
    id: 'questao_trilha_01_modulo_03_q01',
    enunciado: 'O que é educação financeira?',
    moduloId: 'trilha_01_modulo_03',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Aprender a ganhar muito dinheiro' },
      { id: 'B', texto: 'Saber administrar e planejar o uso do dinheiro' },
      { id: 'C', texto: 'Gastar todo o dinheiro que ganha' },
      { id: 'D', texto: 'Guardar dinheiro embaixo do colchão' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Educação financeira é o conhecimento sobre como administrar, poupar e investir dinheiro de forma consciente.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 1,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_01_modulo_03_q02',
    enunciado: 'Por que é importante poupar dinheiro?',
    moduloId: 'trilha_01_modulo_03',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Para realizar sonhos e enfrentar imprevistos' },
      { id: 'B', texto: 'Porque é obrigatório' },
      { id: 'C', texto: 'Para impressionar os amigos' },
      { id: 'D', texto: 'Não é importante poupar' },
    ],
    respostaCorreta: 'A',
    explicacao: 'Poupar é importante para realizar objetivos futuros e ter segurança financeira em situações inesperadas.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 2,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_01_modulo_03_q03',
    enunciado: 'O que é um orçamento?',
    moduloId: 'trilha_01_modulo_03',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Uma lista de desejos' },
      { id: 'B', texto: 'Um plano de como gastar e economizar dinheiro' },
      { id: 'C', texto: 'Um tipo de investimento' },
      { id: 'D', texto: 'Uma conta bancária' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Orçamento é um planejamento que mostra quanto dinheiro você recebe e como vai gastá-lo ou economizá-lo.',
    dificuldade: 'medio',
    pontos: 15,
    ordem: 3,
    tipo: 'multipla_escolha',
  },
];

// ============================================
// DADOS: BADGES
// ============================================
const badges = [
  {
    id: 'badge_primeira_trilha',
    nome: 'Primeiro Passo',
    descricao: 'Complete sua primeira trilha',
    icone: '🎯',
    cor: '#4CAF50',
    requisito: {
      tipo: 'completar_trilhas',
      quantidade: 1,
      detalhes: 'Complete qualquer trilha',
    },
    raridade: 'comum',
    pontos: 100,
    ordem: 1,
  },
  {
    id: 'badge_10_questoes',
    nome: 'Estudioso',
    descricao: 'Responda 10 questões corretamente',
    icone: '📚',
    cor: '#2196F3',
    requisito: {
      tipo: 'questoes_corretas',
      quantidade: 10,
      detalhes: 'Acerte 10 questões',
    },
    raridade: 'comum',
    pontos: 50,
    ordem: 2,
  },
  {
    id: 'badge_7_dias_consecutivos',
    nome: 'Dedicado',
    descricao: 'Acesse o app por 7 dias consecutivos',
    icone: '🔥',
    cor: '#FF9800',
    requisito: {
      tipo: 'dias_consecutivos',
      quantidade: 7,
      detalhes: '7 dias de streak',
    },
    raridade: 'raro',
    pontos: 150,
    ordem: 3,
  },
  {
    id: 'badge_todas_trilhas',
    nome: 'Mestre Financeiro',
    descricao: 'Complete todas as trilhas',
    icone: '👑',
    cor: '#9C27B0',
    requisito: {
      tipo: 'completar_trilhas',
      quantidade: 5,
      detalhes: 'Complete as 5 trilhas',
    },
    raridade: 'lendario',
    pontos: 500,
    ordem: 4,
  },
];

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================
async function populateFirestore() {
  console.log('🚀 Iniciando população do Firestore...\n');

  try {
    // Criar Trilhas
    console.log('📚 Criando trilhas...');
    for (const trilha of trilhas) {
      await setDoc(doc(db, 'trilhaId', trilha.id), trilha);
      console.log(`  ✅ Trilha criada: ${trilha.titulo}`);
    }

    // Criar Módulos
    console.log('\n📦 Criando módulos...');
    for (const modulo of modulos) {
      await setDoc(doc(db, 'moduloId', modulo.id), modulo);
      console.log(`  ✅ Módulo criado: ${modulo.titulo}`);
    }

    // Criar Histórias
    console.log('\n📖 Criando histórias...');
    for (const historia of historias) {
      await setDoc(doc(db, 'historias', historia.id), historia);
      console.log(`  ✅ História criada: ${historia.titulo}`);
    }

    // Criar Questões
    console.log('\n❓ Criando questões...');
    for (const questao of questoes) {
      await setDoc(doc(db, 'questao', questao.id), questao);
      console.log(`  ✅ Questão criada: ${questao.enunciado.substring(0, 50)}...`);
    }

    // Criar Badges
    console.log('\n🎖️ Criando badges...');
    for (const badge of badges) {
      await setDoc(doc(db, 'badges', badge.id), badge);
      console.log(`  ✅ Badge criado: ${badge.nome}`);
    }

    console.log('\n✨ Firestore populado com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`  - ${trilhas.length} trilhas`);
    console.log(`  - ${modulos.length} módulos`);
    console.log(`  - ${historias.length} histórias`);
    console.log(`  - ${questoes.length} questões`);
    console.log(`  - ${badges.length} badges`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular Firestore:', error);
    process.exit(1);
  }
}

// Executar
populateFirestore();

