/**
 * Script para popular o Firestore com dados iniciais (Admin SDK)
 * Execute: node scripts/populateFirestore.js
 */

import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente do arquivo .env na raiz do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Inicializar Firebase Admin via service account
let serviceAccountPath = process.env.FINGO_SERVICE_ACCOUNT
  ? path.resolve(__dirname, process.env.FINGO_SERVICE_ACCOUNT)
  : path.resolve(__dirname, 'fingo-app-5d9ec-firebase-adminsdk-fbsvc-c633fb1966.json');

if (!fs.existsSync(serviceAccountPath)) {
  // fallback padrão
  const fallback = path.resolve(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(fallback)) {
    serviceAccountPath = fallback;
  } else {
    console.error('❌ Arquivo de service account não encontrado em:', serviceAccountPath);
    console.error('   Coloque o JSON em scripts/ e tente novamente.');
    process.exit(1);
  }
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
initializeAdminApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Remove campos undefined/NaN recursivamente (Firestore não aceita)
function sanitize(value) {
  if (Array.isArray(value)) {
    return value.map(sanitize).filter((v) => v !== undefined);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const sv = sanitize(v);
      if (sv !== undefined) out[k] = sv;
    }
    return out;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
  }
  if (value === undefined) return undefined;
  return value;
}

// ============================================
// DADOS: TRILHAS
// ============================================
const trilhas = [
  {
    id: 'trilha_01',
    titulo: 'O Mundo do Dinheiro',
    descricao: 'Da troca ao Pix: a história e função do dinheiro.',
    ordem: 1,
    icone: '💰',
    cor: '#4CAF50',
    totalModulos: 3,
    totalQuestoes: 6,
    pontosTotal: 300,
    duracao: 30,
    prerequisitos: [],
    ativa: true,
  },
  {
    id: 'trilha_02',
    titulo: 'Para Onde Vai a Mesada?',
    descricao: 'Diferenciar desejos e necessidades e planejar o orçamento.',
    ordem: 2,
    icone: '🧾',
    cor: '#2196F3',
    totalModulos: 4,
    totalQuestoes: 6,
    pontosTotal: 300,
    duracao: 30,
    prerequisitos: ['trilha_01'],
    ativa: true,
  },
  {
    id: 'trilha_03',
    titulo: 'O Poder de Poupar',
    descricao: 'Por que guardar dinheiro e como começar.',
    ordem: 3,
    icone: '🏦',
    cor: '#FF9800',
    totalModulos: 2,
    totalQuestoes: 6,
    pontosTotal: 150,
    duracao: 15,
    prerequisitos: ['trilha_02'],
    ativa: true,
  },
  {
    id: 'trilha_04',
    titulo: 'Onde o Dinheiro Mora?',
    descricao: 'Bancos, contas e segurança do dinheiro.',
    ordem: 4,
    icone: '🏦',
    cor: '#9C27B0',
    totalModulos: 2,
    totalQuestoes: 6,
    pontosTotal: 150,
    duracao: 15,
    prerequisitos: ['trilha_03'],
    ativa: true,
  },
  {
    id: 'trilha_05',
    titulo: 'Fazendo o Dinheiro Trabalhar',
    descricao: 'Introdução a investimentos e diversificação.',
    ordem: 5,
    icone: '📈',
    cor: '#F44336',
    totalModulos: 2,
    totalQuestoes: 6,
    pontosTotal: 150,
    duracao: 15,
    prerequisitos: ['trilha_04'],
    ativa: true,
  },
  {
    id: 'trilha_06',
    titulo: 'Trabalhando e Impostos',
    descricao: 'Do bruto ao líquido, descontos e função social dos impostos.',
    ordem: 6,
    icone: '🧮',
    cor: '#3F51B5',
    totalModulos: 3,
    totalQuestoes: 6,
    pontosTotal: 300,
    duracao: 30,
    prerequisitos: ['trilha_05'],
    ativa: true,
  },
  {
    id: 'trilha_07',
    titulo: 'Compras Inteligentes',
    descricao: 'Evite impulso, compare preços e conheça seus direitos.',
    ordem: 7,
    icone: '🛒',
    cor: '#00BCD4',
    totalModulos: 3,
    totalQuestoes: 6,
    pontosTotal: 300,
    duracao: 30,
    prerequisitos: ['trilha_06'],
    ativa: true,
  },
  {
    id: 'trilha_08',
    titulo: 'Dinheiro Digital e Segurança',
    descricao: 'Cripto, golpes online e proteção de contas.',
    ordem: 8,
    icone: '🛡️',
    cor: '#795548',
    totalModulos: 3,
    totalQuestoes: 6,
    pontosTotal: 300,
    duracao: 30,
    prerequisitos: ['trilha_07'],
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
    titulo: 'A Origem de Tudo',
    descricao: 'Do escambo ao Pix: como surgiu o dinheiro.',
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
    titulo: 'Quiz: O Mundo do Dinheiro',
    descricao: 'Questões sobre a história e função do dinheiro.',
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
    titulo: 'Quereres e Necessidades',
    descricao: 'O que é essencial e o que é desejo.',
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
    titulo: 'A Arte de Fazer o Dinheiro Durar',
    descricao: 'Introdução ao orçamento: dividir em gastar/guardar/doar.',
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
    titulo: 'Quiz: Orçamento e Prioridades',
    descricao: 'Questões sobre necessidades, desejos e orçamento.',
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

  // TRILHA 03 - adicionar módulo de quiz
  {
    id: 'trilha_03_modulo_02',
    titulo: 'Quiz: Começando a Guardar',
    descricao: 'Questões sobre poupar e metas.',
    trilhaId: 'trilha_03',
    ordem: 2,
    tipo: 'quiz',
    duracao: 10,
    pontos: 100,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: [],
  },

  // TRILHA 04 - adicionar módulo de quiz
  {
    id: 'trilha_04_modulo_02',
    titulo: 'Quiz: Bancos e Contas',
    descricao: 'Questões sobre uso de bancos e segurança.',
    trilhaId: 'trilha_04',
    ordem: 2,
    tipo: 'quiz',
    duracao: 10,
    pontos: 100,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: [],
  },

  // TRILHA 05 - adicionar módulo de quiz
  {
    id: 'trilha_05_modulo_02',
    titulo: 'Quiz: O Que é Investir?',
    descricao: 'Questões básicas de investimentos e diversificação.',
    trilhaId: 'trilha_05',
    ordem: 2,
    tipo: 'quiz',
    duracao: 10,
    pontos: 100,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: [],
  },

  // TRILHA 06 - Trabalho e Impostos
  {
    id: 'trilha_06_modulo_01',
    titulo: 'O Valor do Seu Tempo',
    descricao: 'Trabalho, freela e preço do seu serviço.',
    trilhaId: 'trilha_06',
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
    id: 'trilha_06_modulo_02',
    titulo: 'Bruto vs Líquido',
    descricao: 'Descontos de INSS e conceito de salário líquido.',
    trilhaId: 'trilha_06',
    ordem: 2,
    tipo: 'video',
    duracao: 8,
    pontos: 80,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_06_modulo_01'],
  },
  {
    id: 'trilha_06_modulo_03',
    titulo: 'Quiz: Impostos e Descontos',
    descricao: 'O leão e a cidade: para onde vai o dinheiro dos impostos?',
    trilhaId: 'trilha_06',
    ordem: 3,
    tipo: 'quiz',
    duracao: 10,
    pontos: 100,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_06_modulo_02'],
  },

  // TRILHA 07 - Compras Inteligentes
  {
    id: 'trilha_07_modulo_01',
    titulo: 'Desejo vs Necessidade',
    descricao: 'Como o marketing influencia e a regra da espera.',
    trilhaId: 'trilha_07',
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
    id: 'trilha_07_modulo_02',
    titulo: 'Detector de Preço Justo',
    descricao: 'Pesquisa de preços e custo-benefício.',
    trilhaId: 'trilha_07',
    ordem: 2,
    tipo: 'video',
    duracao: 8,
    pontos: 80,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_07_modulo_01'],
  },
  {
    id: 'trilha_07_modulo_03',
    titulo: 'Quiz: Compras Inteligentes',
    descricao: 'Direitos do consumidor, garantia e nota fiscal.',
    trilhaId: 'trilha_07',
    ordem: 3,
    tipo: 'quiz',
    duracao: 10,
    pontos: 100,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_07_modulo_02'],
  },

  // TRILHA 08 - Dinheiro Digital e Segurança
  {
    id: 'trilha_08_modulo_01',
    titulo: 'Dinheiro Invisível',
    descricao: 'Cripto, volatilidade e riscos.',
    trilhaId: 'trilha_08',
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
    id: 'trilha_08_modulo_02',
    titulo: 'Radar Anti-Golpe',
    descricao: 'Phishing, golpe do Pix e regra de ouro.',
    trilhaId: 'trilha_08',
    ordem: 2,
    tipo: 'video',
    duracao: 8,
    pontos: 80,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_08_modulo_01'],
  },
  {
    id: 'trilha_08_modulo_03',
    titulo: 'Quiz: Segurança Digital',
    descricao: 'Senhas fortes, 2FA e boas práticas.',
    trilhaId: 'trilha_08',
    ordem: 3,
    tipo: 'quiz',
    duracao: 10,
    pontos: 100,
    urlConteudo: '',
    thumbnail: '',
    ativo: true,
    prerequisitos: ['trilha_08_modulo_02'],
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
    titulo: 'A Origem de Tudo',
    conteudo: `E se você precisasse trocar sua merenda por uma galinha? Estranho? Esse era o escambo. Para organizar a bagunça, surgiu o dinheiro: primeiro objetos valiosos, depois moedas, notas e hoje o PIX. O dinheiro facilita as trocas e nos ajuda a planejar a vida.`,
    personagens: [
      { nome: 'Mascote FinGo', avatar: '🦊' }
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
    titulo: 'Quereres e Necessidades',
    conteudo: `Nem tudo que queremos é essencial. Necessidades são coisas como comida e transporte; desejos são itens legais, mas não indispensáveis. Separar desejo de necessidade é o primeiro passo para um bom orçamento.`,
    personagens: [
      { nome: 'Mascote FinGo', avatar: '🦊' }
    ],
    duracao: 6,
    urlAudio: '',
    imagens: [],
    ordem: 1,
    pontos: 60,
  },
  {
    id: 'historia_trilha_03_modulo_01',
    moduloId: 'trilha_03_modulo_01',
    trilhaId: 'trilha_03',
    titulo: 'Começando a Guardar',
    conteudo: `Poupar é guardar uma parte do seu dinheiro hoje para realizar sonhos amanhã. Comece com pouco e com constância: ao receber, reserve uma parte antes de gastar.`,
    personagens: [ { nome: 'Mascote FinGo', avatar: '🦊' } ],
    duracao: 5,
    urlAudio: '',
    imagens: [],
    ordem: 1,
    pontos: 50,
  },
  {
    id: 'historia_trilha_04_modulo_01',
    moduloId: 'trilha_04_modulo_01',
    trilhaId: 'trilha_04',
    titulo: 'Bancos e Contas',
    conteudo: `Bancos guardam seu dinheiro com segurança e oferecem serviços como pagamento, poupança e investimentos. Guardar em casa é arriscado e não rende.`,
    personagens: [ { nome: 'Mascote FinGo', avatar: '🦊' } ],
    duracao: 6,
    urlAudio: '',
    imagens: [],
    ordem: 1,
    pontos: 60,
  },
  {
    id: 'historia_trilha_05_modulo_01',
    moduloId: 'trilha_05_modulo_01',
    trilhaId: 'trilha_05',
    titulo: 'O Que é Investir?',
    conteudo: `Investir é aplicar dinheiro para que gere mais dinheiro com o tempo. Cada investimento tem riscos e retornos; diversificar ajuda a reduzir riscos.`,
    personagens: [ { nome: 'Mascote FinGo', avatar: '🦊' } ],
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
    id: 'questao_trilha_01_modulo_01_q01',
    enunciado: 'Antes do dinheiro, como as pessoas conseguiam o que precisavam?',
    moduloId: 'trilha_01_modulo_01',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Pedindo emprestado' },
      { id: 'B', texto: 'Fazendo trocas (escambo)' },
      { id: 'C', texto: 'Ganhando de presente' },
      { id: 'D', texto: 'Achando na rua' },
    ],
    respostaCorreta: 'B',
    explicacao: 'O escambo era a troca direta de um produto por outro, sem moedas.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 1,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_01_modulo_01_q02',
    enunciado: 'Qual foi um dos primeiros objetos usados como “dinheiro” por ter valor para muitos?',
    moduloId: 'trilha_01_modulo_01',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Folhas de papel' },
      { id: 'B', texto: 'Conchas e sal' },
      { id: 'C', texto: 'Pedras comuns' },
      { id: 'D', texto: 'Desenhos' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Conchas e sal já foram usados como meio de troca por seu valor social.',
    dificuldade: 'medio',
    pontos: 10,
    ordem: 2,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_01_modulo_01_q03',
    enunciado: 'Por que as moedas de metal (ouro, prata) se tornaram populares?',
    moduloId: 'trilha_01_modulo_01',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Porque eram bonitas' },
      { id: 'B', texto: 'Porque eram fáceis de carregar e raras' },
      { id: 'C', texto: 'Porque eram leves como papel' },
      { id: 'D', texto: 'Porque todos tinham muitas' },
    ],
    respostaCorreta: 'B',
    explicacao: 'O valor vinha da raridade do metal e da facilidade de transporte.',
    dificuldade: 'dificil',
    pontos: 10,
    ordem: 3,
    tipo: 'multipla_escolha',
  },
  // Trilha 01 - Módulo 03 (outras 3 para totalizar 6)
  {
    id: 'questao_trilha_01_modulo_03_q01',
    enunciado: 'Qual a principal vantagem do PIX em relação a moedas de ouro?',
    moduloId: 'trilha_01_modulo_03',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'É mais brilhante' },
      { id: 'B', texto: 'É instantâneo e não precisa ser carregado' },
      { id: 'C', texto: 'Pode ser derretido' },
      { id: 'D', texto: 'Não precisa de celular' },
    ],
    respostaCorreta: 'B',
    explicacao: 'O PIX permite transferências instantâneas e sem transporte físico.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 1,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_01_modulo_03_q02',
    enunciado: 'Por que o escambo era difícil de usar no dia a dia?',
    moduloId: 'trilha_01_modulo_03',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Porque todo mundo tinha muito sal' },
      { id: 'B', texto: 'Porque era difícil achar trocas equivalentes' },
      { id: 'C', texto: 'Porque não existiam mercados' },
      { id: 'D', texto: 'Porque o governo proibiu' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Faltava um padrão de valor; era difícil encontrar quem quisesse exatamente o seu item.',
    dificuldade: 'medio',
    pontos: 10,
    ordem: 2,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_01_modulo_03_q03',
    enunciado: 'Qual foi uma forma antiga de pagamento que inspirou a palavra salário?',
    moduloId: 'trilha_01_modulo_03',
    trilhaId: 'trilha_01',
    opcoes: [
      { id: 'A', texto: 'Conchas' },
      { id: 'B', texto: 'Sal' },
      { id: 'C', texto: 'Penas' },
      { id: 'D', texto: 'Pedras' },
    ],
    respostaCorreta: 'B',
    explicacao: 'O “salário” tem origem no sal, usado como meio de pagamento.',
    dificuldade: 'dificil',
    pontos: 10,
    ordem: 3,
    tipo: 'multipla_escolha',
  },

  // Trilha 02 - Módulo 03
  {
    id: 'questao_trilha_02_modulo_03_q01',
    enunciado: 'O que é uma necessidade?',
    moduloId: 'trilha_02_modulo_03',
    trilhaId: 'trilha_02',
    opcoes: [
      { id: 'A', texto: 'Um brinquedo novo' },
      { id: 'B', texto: 'Algo essencial como comida' },
      { id: 'C', texto: 'Um passeio no parque' },
      { id: 'D', texto: 'Um jogo do momento' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Necessidades são itens essenciais à vida, como alimentação e saúde.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 1,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_02_modulo_03_q02',
    enunciado: 'Comprar o videogame do momento é exemplo de…',
    moduloId: 'trilha_02_modulo_03',
    trilhaId: 'trilha_02',
    opcoes: [
      { id: 'A', texto: 'Necessidade urgente' },
      { id: 'B', texto: 'Desejo (querer)' },
      { id: 'C', texto: 'Investimento' },
      { id: 'D', texto: 'Obrigação' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Desejo é algo que queremos mas não é essencial.',
    dificuldade: 'medio',
    pontos: 10,
    ordem: 2,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_02_modulo_03_q03',
    enunciado: 'Qual o primeiro passo para organizar a mesada?',
    moduloId: 'trilha_02_modulo_03',
    trilhaId: 'trilha_02',
    opcoes: [
      { id: 'A', texto: 'Gastar tudo em doces' },
      { id: 'B', texto: 'Esconder o dinheiro' },
      { id: 'C', texto: 'Separar necessidades e desejos' },
      { id: 'D', texto: 'Emprestar a um amigo' },
    ],
    respostaCorreta: 'C',
    explicacao: 'Separar o que é essencial ajuda a priorizar os gastos.',
    dificuldade: 'dificil',
    pontos: 10,
    ordem: 3,
    tipo: 'multipla_escolha',
  },

  // Trilha 03 - Módulo 02
  {
    id: 'questao_trilha_03_modulo_02_q01',
    enunciado: 'O que significa “poupar”?',
    moduloId: 'trilha_03_modulo_02',
    trilhaId: 'trilha_03',
    opcoes: [
      { id: 'A', texto: 'Gastar todo o dinheiro' },
      { id: 'B', texto: 'Guardar parte do dinheiro para o futuro' },
      { id: 'C', texto: 'Dar dinheiro para um amigo' },
      { id: 'D', texto: 'Trocar por figurinhas' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Poupar é reservar agora para um objetivo futuro.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 1,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_03_modulo_02_q02',
    enunciado: 'Qual a melhor forma de começar a poupar?',
    moduloId: 'trilha_03_modulo_02',
    trilhaId: 'trilha_03',
    opcoes: [
      { id: 'A', texto: 'Esperar sobrar no final do mês' },
      { id: 'B', texto: 'Guardar uma quantia assim que receber' },
      { id: 'C', texto: 'Gastar primeiro' },
      { id: 'D', texto: 'Comprar um lanche caro' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Pagar-se primeiro garante o hábito.',
    dificuldade: 'medio',
    pontos: 10,
    ordem: 2,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_03_modulo_02_q03',
    enunciado: 'Se você poupar R$5 por mês, quanto terá em um ano?',
    moduloId: 'trilha_03_modulo_02',
    trilhaId: 'trilha_03',
    opcoes: [
      { id: 'A', texto: 'R$50' },
      { id: 'B', texto: 'R$12' },
      { id: 'C', texto: 'R$60' },
      { id: 'D', texto: 'R$5' },
    ],
    respostaCorreta: 'C',
    explicacao: '12 meses x R$5 = R$60.',
    dificuldade: 'dificil',
    pontos: 10,
    ordem: 3,
    tipo: 'multipla_escolha',
  },

  // Trilha 04 - Módulo 02
  {
    id: 'questao_trilha_04_modulo_02_q01',
    enunciado: 'Para que serve um banco?',
    moduloId: 'trilha_04_modulo_02',
    trilhaId: 'trilha_04',
    opcoes: [
      { id: 'A', texto: 'Fabricar dinheiro' },
      { id: 'B', texto: 'Guardar dinheiro com segurança' },
      { id: 'C', texto: 'Dar doces' },
      { id: 'D', texto: 'Apenas guardar moedas' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Bancos guardam e movimentam seu dinheiro com segurança.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 1,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_04_modulo_02_q02',
    enunciado: 'O que pode acontecer com o dinheiro na poupança?',
    moduloId: 'trilha_04_modulo_02',
    trilhaId: 'trilha_04',
    opcoes: [
      { id: 'A', texto: 'Diminui automaticamente' },
      { id: 'B', texto: 'Fica parado sem mudar' },
      { id: 'C', texto: 'Pode render juros e aumentar' },
      { id: 'D', texto: 'Some' },
    ],
    respostaCorreta: 'C',
    explicacao: 'A poupança rende um pouco de juros.',
    dificuldade: 'medio',
    pontos: 10,
    ordem: 2,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_04_modulo_02_q03',
    enunciado: 'Qual a principal desvantagem de guardar todo o dinheiro em casa?',
    moduloId: 'trilha_04_modulo_02',
    trilhaId: 'trilha_04',
    opcoes: [
      { id: 'A', texto: 'É mais seguro' },
      { id: 'B', texto: 'Pode ser perdido/roubado e não rende' },
      { id: 'C', texto: 'Rende mais que no banco' },
      { id: 'D', texto: 'É mais fácil de gastar' },
    ],
    respostaCorreta: 'B',
    explicacao: 'Risco de perda e sem rendimento por juros.',
    dificuldade: 'dificil',
    pontos: 10,
    ordem: 3,
    tipo: 'multipla_escolha',
  },

  // Trilha 05 - Módulo 02
  {
    id: 'questao_trilha_05_modulo_02_q01',
    enunciado: 'Investir significa…',
    moduloId: 'trilha_05_modulo_02',
    trilhaId: 'trilha_05',
    opcoes: [
      { id: 'A', texto: 'Esconder o dinheiro' },
      { id: 'B', texto: 'Gastar em coisas caras' },
      { id: 'C', texto: 'Aplicar dinheiro para gerar mais dinheiro' },
      { id: 'D', texto: 'Doar todo o dinheiro' },
    ],
    respostaCorreta: 'C',
    explicacao: 'Aplicar recursos para obter retorno futuro.',
    dificuldade: 'facil',
    pontos: 10,
    ordem: 1,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_05_modulo_02_q02',
    enunciado: 'Por que investir pode ser melhor do que só poupar?',
    moduloId: 'trilha_05_modulo_02',
    trilhaId: 'trilha_05',
    opcoes: [
      { id: 'A', texto: 'Porque é mais arriscado' },
      { id: 'B', texto: 'Não há diferença' },
      { id: 'C', texto: 'Potencial de rendimento maior' },
      { id: 'D', texto: 'O dinheiro fica preso' },
    ],
    respostaCorreta: 'C',
    explicacao: 'Investimentos têm potencial de retorno superior no longo prazo.',
    dificuldade: 'medio',
    pontos: 10,
    ordem: 2,
    tipo: 'multipla_escolha',
  },
  {
    id: 'questao_trilha_05_modulo_02_q03',
    enunciado: 'O que significa “diversificar” investimentos?',
    moduloId: 'trilha_05_modulo_02',
    trilhaId: 'trilha_05',
    opcoes: [
      { id: 'A', texto: 'Colocar tudo em um único lugar' },
      { id: 'B', texto: 'Gastar com coisas diversas' },
      { id: 'C', texto: 'Dividir em diferentes tipos de investimentos' },
      { id: 'D', texto: 'Nunca investir' },
    ],
    respostaCorreta: 'C',
    explicacao: 'Espalhar o risco entre ativos diferentes.',
    dificuldade: 'dificil',
    pontos: 10,
    ordem: 3,
    tipo: 'multipla_escolha',
  },

  // Trilha 06 - Módulo 03 (6 questões)
  { id: 'questao_trilha_06_modulo_03_q01', enunciado: 'Salário bruto é…', moduloId: 'trilha_06_modulo_03', trilhaId: 'trilha_06', opcoes: [ {id:'A',texto:'O que cai na conta'}, {id:'B',texto:'Antes dos descontos'}, {id:'C',texto:'Depois dos descontos'}, {id:'D',texto:'Somente bônus'} ], respostaCorreta: 'B', explicacao: 'Bruto é o valor sem descontos.', dificuldade: 'facil', pontos: 10, ordem: 1, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_06_modulo_03_q02', enunciado: 'Salário líquido é…', moduloId: 'trilha_06_modulo_03', trilhaId: 'trilha_06', opcoes: [ {id:'A',texto:'Antes dos descontos'}, {id:'B',texto:'Depois dos descontos'}, {id:'C',texto:'Somente 13º'}, {id:'D',texto:'Premiação'} ], respostaCorreta: 'B', explicacao: 'Líquido é o que você usa.', dificuldade: 'medio', pontos: 10, ordem: 2, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_06_modulo_03_q03', enunciado: 'Qual desconto é de previdência?', moduloId: 'trilha_06_modulo_03', trilhaId: 'trilha_06', opcoes: [ {id:'A',texto:'INSS'}, {id:'B',texto:'IPTU'}, {id:'C',texto:'ISS'}, {id:'D',texto:'ICMS'} ], respostaCorreta: 'A', explicacao: 'INSS é previdência.', dificuldade: 'dificil', pontos: 10, ordem: 3, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_06_modulo_03_q04', enunciado: 'Impostos financiam…', moduloId: 'trilha_06_modulo_03', trilhaId: 'trilha_06', opcoes: [ {id:'A',texto:'Serviços públicos'}, {id:'B',texto:'Somente bancos'}, {id:'C',texto:'Apostas'}, {id:'D',texto:'Nada'} ], respostaCorreta: 'A', explicacao: 'Pagam educação, saúde etc.', dificuldade: 'facil', pontos: 10, ordem: 4, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_06_modulo_03_q05', enunciado: 'Exemplo de desconto comum:', moduloId: 'trilha_06_modulo_03', trilhaId: 'trilha_06', opcoes: [ {id:'A',texto:'INSS'}, {id:'B',texto:'Cupom de loja'}, {id:'C',texto:'Brinde'}, {id:'D',texto:'Cheque'} ], respostaCorreta: 'A', explicacao: 'INSS incide na folha.', dificuldade: 'medio', pontos: 10, ordem: 5, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_06_modulo_03_q06', enunciado: 'Planejar com o líquido ajuda a…', moduloId: 'trilha_06_modulo_03', trilhaId: 'trilha_06', opcoes: [ {id:'A',texto:'Gastar tudo rápido'}, {id:'B',texto:'Evitar surpresas'}, {id:'C',texto:'Pagar mais impostos'}, {id:'D',texto:'Perder renda'} ], respostaCorreta: 'B', explicacao: 'Você usa o que de fato recebe.', dificuldade: 'dificil', pontos: 10, ordem: 6, tipo: 'multipla_escolha' },

  // Trilha 07 - Módulo 03 (6 questões)
  { id: 'questao_trilha_07_modulo_03_q01', enunciado: 'A Regra da Espera ajuda a…', moduloId: 'trilha_07_modulo_03', trilhaId: 'trilha_07', opcoes: [ {id:'A',texto:'Comprar por impulso'}, {id:'B',texto:'Evitar impulso'}, {id:'C',texto:'Pagar multas'}, {id:'D',texto:'Perder garantia'} ], respostaCorreta: 'B', explicacao: 'Esperar reduz compras por impulso.', dificuldade: 'facil', pontos: 10, ordem: 1, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_07_modulo_03_q02', enunciado: 'Comparar preços significa…', moduloId: 'trilha_07_modulo_03', trilhaId: 'trilha_07', opcoes: [ {id:'A',texto:'Ver só uma loja'}, {id:'B',texto:'Ver várias opções'}, {id:'C',texto:'Esperar promoções ilegais'}, {id:'D',texto:'Ignorar qualidade'} ], respostaCorreta: 'B', explicacao: 'Compare ao menos 3 lugares.', dificuldade: 'medio', pontos: 10, ordem: 2, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_07_modulo_03_q03', enunciado: 'Nota fiscal serve para…', moduloId: 'trilha_07_modulo_03', trilhaId: 'trilha_07', opcoes: [ {id:'A',texto:'Provar compra e garantir direitos'}, {id:'B',texto:'Decoração'}, {id:'C',texto:'Cupom de apostas'}, {id:'D',texto:'Brincadeira'} ], respostaCorreta: 'A', explicacao: 'É o seu comprovante.', dificuldade: 'dificil', pontos: 10, ordem: 3, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_07_modulo_03_q04', enunciado: 'Custo-benefício é…', moduloId: 'trilha_07_modulo_03', trilhaId: 'trilha_07', opcoes: [ {id:'A',texto:'Sempre o mais barato'}, {id:'B',texto:'Equilíbrio preço/qualidade'}, {id:'C',texto:'Marca mais famosa'}, {id:'D',texto:'Preço mais alto'} ], respostaCorreta: 'B', explicacao: 'Olhe qualidade pelo preço.', dificuldade: 'facil', pontos: 10, ordem: 4, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_07_modulo_03_q05', enunciado: 'Garantia cobre…', moduloId: 'trilha_07_modulo_03', trilhaId: 'trilha_07', opcoes: [ {id:'A',texto:'Defeitos do produto'}, {id:'B',texto:'Desejos'}, {id:'C',texto:'Impostos'}, {id:'D',texto:'Promoções'} ], respostaCorreta: 'A', explicacao: 'Defeitos dentro do prazo.', dificuldade: 'medio', pontos: 10, ordem: 5, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_07_modulo_03_q06', enunciado: 'Direito básico do consumidor:', moduloId: 'trilha_07_modulo_03', trilhaId: 'trilha_07', opcoes: [ {id:'A',texto:'Devolver produto defeituoso'}, {id:'B',texto:'Cobrar preço extra'}, {id:'C',texto:'Trocar sem motivo sempre'}, {id:'D',texto:'Sem nota fiscal'} ], respostaCorreta: 'A', explicacao: 'Defeito dentro da lei.', dificuldade: 'dificil', pontos: 10, ordem: 6, tipo: 'multipla_escolha' },

  // Trilha 08 - Módulo 03 (6 questões)
  { id: 'questao_trilha_08_modulo_03_q01', enunciado: 'Criptomoeda é…', moduloId: 'trilha_08_modulo_03', trilhaId: 'trilha_08', opcoes: [ {id:'A',texto:'Dinheiro físico'}, {id:'B',texto:'Dinheiro digital descentralizado'}, {id:'C',texto:'Cupom'}, {id:'D',texto:'Cheque'} ], respostaCorreta: 'B', explicacao: 'Ativo digital', dificuldade: 'facil', pontos: 10, ordem: 1, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_08_modulo_03_q02', enunciado: 'Phishing é…', moduloId: 'trilha_08_modulo_03', trilhaId: 'trilha_08', opcoes: [ {id:'A',texto:'Promoção real'}, {id:'B',texto:'Golpe por e-mail/links'}, {id:'C',texto:'Imposto'}, {id:'D',texto:'Investimento'} ], respostaCorreta: 'B', explicacao: 'Engana para roubar dados.', dificuldade: 'medio', pontos: 10, ordem: 2, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_08_modulo_03_q03', enunciado: '2FA significa…', moduloId: 'trilha_08_modulo_03', trilhaId: 'trilha_08', opcoes: [ {id:'A',texto:'Duas formas de autenticação'}, {id:'B',texto:'Dois cartões'}, {id:'C',texto:'Dois bancos'}, {id:'D',texto:'Dois celulares'} ], respostaCorreta: 'A', explicacao: 'Duplo fator de segurança.', dificuldade: 'dificil', pontos: 10, ordem: 3, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_08_modulo_03_q04', enunciado: 'Golpe do Pix é…', moduloId: 'trilha_08_modulo_03', trilhaId: 'trilha_08', opcoes: [ {id:'A',texto:'Pedido urgente falso'}, {id:'B',texto:'Taxa oficial'}, {id:'C',texto:'Desconto de INSS'}, {id:'D',texto:'Promoção bancária'} ], respostaCorreta: 'A', explicacao: 'Pressiona para enviar dinheiro.', dificuldade: 'facil', pontos: 10, ordem: 4, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_08_modulo_03_q05', enunciado: 'Senha forte contém…', moduloId: 'trilha_08_modulo_03', trilhaId: 'trilha_08', opcoes: [ {id:'A',texto:'Apenas números'}, {id:'B',texto:'Letras, números e símbolos'}, {id:'C',texto:'Nome do usuário'}, {id:'D',texto:'Data de nascimento'} ], respostaCorreta: 'B', explicacao: 'Misture tipos de caracteres.', dificuldade: 'medio', pontos: 10, ordem: 5, tipo: 'multipla_escolha' },
  { id: 'questao_trilha_08_modulo_03_q06', enunciado: 'Ao suspeitar de golpe você deve…', moduloId: 'trilha_08_modulo_03', trilhaId: 'trilha_08', opcoes: [ {id:'A',texto:'Enviar dados rápido'}, {id:'B',texto:'Confirmar por outro canal'}, {id:'C',texto:'Clicar em qualquer link'}, {id:'D',texto:'Compartilhar o código 2FA'} ], respostaCorreta: 'B', explicacao: 'Valide em outro canal.', dificuldade: 'dificil', pontos: 10, ordem: 6, tipo: 'multipla_escolha' },
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
  console.log(`📁 Projeto (service account): ${serviceAccount.project_id}`);

  try {
    // Criar Trilhas
    console.log('📚 Criando trilhas...');
    for (const trilha of trilhas) {
      await db.collection('trilhaId').doc(trilha.id).set(sanitize(trilha), { merge: true });
      console.log(`  ✅ Trilha criada: ${trilha.titulo}`);
    }

    // Criar Módulos
    console.log('\n📦 Criando módulos...');
    for (const modulo of modulos) {
      await db.collection('moduloId').doc(modulo.id).set(sanitize(modulo), { merge: true });
      console.log(`  ✅ Módulo criado: ${modulo.titulo}`);
    }

    // Criar Histórias
    console.log('\n📖 Criando histórias...');
    for (const historia of historias) {
      await db.collection('historias').doc(historia.id).set(sanitize(historia), { merge: true });
      console.log(`  ✅ História criada: ${historia.titulo}`);
    }

    // Criar Questões
    console.log('\n❓ Criando questões...');
    for (const questao of questoes) {
      await db.collection('questao').doc(questao.id).set(sanitize(questao), { merge: true });
      console.log(`  ✅ Questão criada: ${questao.enunciado.substring(0, 50)}...`);
    }

    // Criar Badges
    console.log('\n🎖️ Criando badges...');
    for (const badge of badges) {
      await db.collection('badges').doc(badge.id).set(sanitize(badge), { merge: true });
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

