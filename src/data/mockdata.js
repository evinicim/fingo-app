// Estrutura unificada de dados para trilhas, histórias e questões baseada no Catálogo de Conteúdo
export const TRILHAS_MOCADAS = [
  {
    id: 'trilha_01',
    titulo: 'O Mundo do Dinheiro',
    descricao: 'Descubra a fascinante história do dinheiro, desde as primeiras trocas até as moedas digitais.',
    ordem: 1,
    icone: null,
    progresso: 0,
    bloqueada: false,
    historia: {
      titulo: 'A Fascinante Jornada do Dinheiro',
      conteudo: `Era uma vez, há muito tempo atrás, quando não existia dinheiro como conhecemos hoje...

As pessoas viviam em pequenas comunidades e precisavam de coisas que não tinham. Como elas conseguiam o que precisavam? Fazendo trocas! 🍎↔️🥖

Imagine: você tem maçãs, mas precisa de pão. Seu vizinho tem pão, mas precisa de maçãs. Vocês fazem uma troca direta! Isso se chama escambo.

Mas e se você tem maçãs e precisa de leite, mas seu vizinho que tem leite não quer maçãs? Aí começaram a surgir os problemas... 🤔

Foi então que as pessoas começaram a usar objetos especiais que todo mundo valorava: conchas bonitas, sal (que era muito raro e precioso), pedras preciosas...

O sal era tão valioso que até hoje usamos a palavra "salário" - que vem de "sal"! 💰

Com o tempo, as pessoas inventaram as moedas de metal - ouro e prata. Por quê? Porque eram:
✨ Raras (poucas pessoas tinham)
✨ Fáceis de carregar
✨ Bonitas e duradouras
✨ Todo mundo aceitava

E assim nasceu o dinheiro como conhecemos! De trocas simples até moedas de metal, o dinheiro evoluiu para facilitar nossa vida. 🚀

Hoje temos até dinheiro digital - mas essa é uma história para outro dia! 😊`,
      duracao: '5 min',
      concluida: false
    },
    modulos: {
      modulo_1_1: {
        id: 'modulo_1_1',
        titulo: 'A Origem de Tudo',
        questoes: [
          {
            id: 'q_1_1_1',
            dificuldade: 'facil',
            pergunta: 'Antes do dinheiro, como as pessoas conseguiam o que precisavam?',
            opcoes: [
              'A) Pedindo emprestado',
              'B) Fazendo trocas (escambo)',
              'C) Ganhando de presente',
              'D) Achando na rua'
            ],
            respostaCorreta: 1,
            explicacao: 'O escambo era a troca direta de um produto por outro, sem usar moedas.'
          },
          {
            id: 'q_1_1_2',
            dificuldade: 'medio',
            pergunta: 'Qual foi um dos primeiros objetos usados como "dinheiro" por ter valor para muitas pessoas?',
            opcoes: [
              'A) Folhas de papel',
              'B) Conchas e sal',
              'C) Pedras comuns',
              'D) Desenhos'
            ],
            respostaCorreta: 1,
            explicacao: 'O sal era tão valioso que deu origem à palavra "salário".'
          },
          {
            id: 'q_1_1_3',
            dificuldade: 'dificil',
            pergunta: 'Por que as moedas de metal (ouro, prata) se tornaram populares?',
            opcoes: [
              'A) Porque eram bonitas',
              'B) Porque eram fáceis de carregar e raras',
              'C) Porque eram leves como papel',
              'D) Porque todos tinham muitas'
            ],
            respostaCorreta: 1,
            explicacao: 'O valor das moedas vinha da raridade do metal e da facilidade de transportá-las.'
          }
        ]
      }
    }
  },
  {
    id: 'trilha_02',
    titulo: 'Para Onde Vai a Mesada?',
    descricao: 'Aprenda a organizar seus gastos e entenda a diferença entre o que você quer e o que você realmente precisa.',
    ordem: 2,
    icone: null,
    progresso: 50,
    bloqueada: false,
    historia: {
      titulo: 'A Aventura da Mesada',
      conteudo: `Lucas recebeu sua mesada de R$ 50,00 e ficou muito animado! 🎉

"O que vou comprar primeiro?", ele pensou. "Um videogame novo? Doces? Um brinquedo legal?"

Mas então sua mãe disse algo importante: "Lucas, antes de gastar tudo, vamos conversar sobre necessidades e desejos."

"Necessidades?", perguntou Lucas confuso.

"Sim! Necessidades são coisas que você PRECISA para viver bem: comida, roupas, material escolar... Já os desejos são coisas que você QUER ter, mas que não são essenciais: brinquedos, doces, videogames."

Lucas pensou: "Então... comida é necessidade, mas doce é desejo?"

"Exato! E o segredo é: primeiro cuidar das necessidades, depois pensar nos desejos."

A mãe de Lucas ensinou uma técnica legal: dividir a mesada em três potes:
🏦 Pote 1: Necessidades (70%)
🎯 Pote 2: Desejos (20%) 
💰 Pote 3: Poupança (10%)

"Assim você sempre tem dinheiro para o que precisa, um pouco para o que quer, e ainda guarda para o futuro!"

Lucas ficou empolgado: "Que legal! Vou começar hoje mesmo!" 

E assim Lucas aprendeu a ser um mestre da mesada! 🏆`,
      duracao: '4 min',
      concluida: false
    },
    modulos: {
      modulo_2_1: {
        id: 'modulo_2_1',
        titulo: 'Quereres e Necessidades',
        questoes: [
          {
            id: 'q_2_1_1',
            dificuldade: 'facil',
            pergunta: 'O que é uma "necessidade"?',
            opcoes: [
              'A) Algo legal, mas que você vive sem',
              'B) Um brinquedo novo',
              'C) Algo essencial para viver, como comida',
              'D) Um passeio no parque'
            ],
            respostaCorreta: 2,
            explicacao: 'Necessidades são coisas que não podemos viver sem, como alimentação, moradia e saúde.'
          },
          {
            id: 'q_2_1_2',
            dificuldade: 'medio',
            pergunta: 'Comprar o videogame do momento é um exemplo de quê?',
            opcoes: [
              'A) Uma necessidade urgente',
              'B) Um desejo ou "querer"',
              'C) Um investimento para o futuro',
              'D) Uma obrigação'
            ],
            respostaCorreta: 1,
            explicacao: 'Desejos são coisas que gostaríamos de ter, mas que não são essenciais para nossa sobrevivência.'
          },
          {
            id: 'q_2_1_3',
            dificuldade: 'dificil',
            pergunta: 'Qual é o primeiro passo para organizar a mesada?',
            opcoes: [
              'A) Gastar tudo em doces',
              'B) Esconder o dinheiro',
              'C) Separar o que é para necessidades e o que é para desejos',
              'D) Emprestar para um amigo'
            ],
            respostaCorreta: 2,
            explicacao: 'Entender a diferença e separar o dinheiro ajuda a garantir que o mais importante seja cuidado primeiro.'
          }
        ]
      }
    }
  },
  {
    id: 'trilha_03',
    titulo: 'O Poder de Poupar',
    descricao: 'Descubra por que guardar dinheiro é o primeiro passo para realizar seus sonhos.',
    ordem: 3,
    icone: null,
    progresso: 0,
    bloqueada: false,
    historia: {
      titulo: 'O Poder Mágico da Poupança',
      conteudo: `Ana tinha um sonho: comprar uma bicicleta nova! 🚴‍♀️

Mas a bicicleta custava R$ 200,00 e ela só recebia R$ 30,00 de mesada por mês.

"Como vou conseguir?", ela pensou triste. "Vai demorar muito..."

Foi então que sua avó contou uma história especial: "Ana, você conhece a história da formiga e da cigarra?"

"A formiga trabalhava o verão todo guardando comida, enquanto a cigarra só cantava. No inverno, a formiga estava preparada e a cigarra passou fome."

"Mas o que isso tem a ver com minha bicicleta?", perguntou Ana.

"Tudo! A formiga ensina que pequenas ações constantes fazem grandes diferenças. Se você guardar R$ 5,00 por mês, em um ano terá R$ 60,00!"

Ana fez as contas: "R$ 5 por mês... em 40 meses teria R$ 200! Mas isso é muito tempo..."

"E se você guardar R$ 10 por mês?", perguntou a avó.

"Em 20 meses! Ainda é muito..."

"E se você guardar R$ 20 por mês?"

"Em 10 meses! Isso é melhor!"

A avó sorriu: "E se você conseguir R$ 5 extras fazendo pequenos trabalhos? Lavando o carro do papai, ajudando a organizar a casa..."

Ana ficou empolgada: "Posso guardar R$ 25 por mês! Em 8 meses terei minha bicicleta!"

E assim Ana descobriu o poder mágico da poupança: pequenas quantias + tempo = grandes sonhos realizados! ✨`,
      duracao: '6 min',
      concluida: false
    },
    modulos: {
      modulo_3_1: {
        id: 'modulo_3_1',
        titulo: 'Começando a Guardar',
        questoes: [
          {
            id: 'q_3_1_1',
            dificuldade: 'facil',
            pergunta: 'O que significa "poupar"?',
            opcoes: [
              'A) Gastar todo o dinheiro',
              'B) Guardar uma parte do dinheiro para o futuro',
              'C) Dar o dinheiro para outra pessoa',
              'D) Trocar dinheiro por figurinhas'
            ],
            respostaCorreta: 1,
            explicacao: 'Poupar é o ato de reservar dinheiro hoje para usar em objetivos futuros.'
          },
          {
            id: 'q_3_1_2',
            dificuldade: 'medio',
            pergunta: 'Qual a melhor forma de começar a poupar sua mesada?',
            opcoes: [
              'A) Esperar sobrar algo no fim do mês',
              'B) Guardar uma pequena quantia assim que receber',
              'C) Gastar primeiro e guardar depois',
              'D) Comprar um lanche caro'
            ],
            respostaCorreta: 1,
            explicacao: 'O hábito de "se pagar primeiro", guardando uma parte logo no início, é o mais eficaz para conseguir poupar.'
          },
          {
            id: 'q_3_1_3',
            dificuldade: 'dificil',
            pergunta: 'Se você poupar R$5 por mês, quanto terá em um ano?',
            opcoes: [
              'A) R$50',
              'B) R$12',
              'C) R$60',
              'D) R$5'
            ],
            respostaCorreta: 2,
            explicacao: 'São 12 meses no ano. Multiplicando 12 por R$5, temos R$60. Isso mostra como pequenas quantias crescem com o tempo!'
          }
        ]
      }
    }
  },
  {
    id: 'trilha_04',
    titulo: 'Onde o Dinheiro Mora?',
    descricao: 'Entenda o que são bancos, contas e por que guardar o dinheiro em um cofrinho pode não ser a melhor ideia.',
    ordem: 4,
    icone: null,
    progresso: 0,
    bloqueada: true,
    historia: {
      titulo: 'A Casa do Dinheiro',
      conteudo: `Pedro guardava todo seu dinheiro em um cofrinho de porquinho. 🐷

"Está seguro aqui!", ele pensava. "Ninguém vai pegar!"

Mas um dia, sua irmã mais velha perguntou: "Pedro, por que você não coloca seu dinheiro no banco?"

"Banco? O que é isso?", perguntou Pedro.

"É como uma casa especial para o dinheiro! Lá ele fica mais seguro e ainda cresce!"

"Como assim cresce?", Pedro ficou curioso.

"É que o banco paga juros! Se você deixar R$ 100,00 na poupança por um ano, no final você terá R$ 105,00!"

"Uau! Dinheiro que cresce sozinho?", Pedro ficou empolgado.

"Só que tem regras: você não pode pegar o dinheiro a qualquer hora, e precisa de um adulto para abrir a conta."

A irmã explicou as vantagens:
🏦 Mais seguro que em casa
💰 Rendimento (juros)
📱 Controle pelo celular
💳 Cartão para compras

"E as desvantagens?", perguntou Pedro.

"Você não pode pegar o dinheiro a qualquer hora, e se não cuidar bem da conta, pode ter taxas."

Pedro pensou: "Então é melhor guardar no banco! Meu dinheiro vai crescer e ficar mais seguro!"

E assim Pedro descobriu que o banco é a melhor casa para o dinheiro! 🏠💰`,
      duracao: '5 min',
      concluida: false
    },
    modulos: {
      modulo_4_1: {
        id: 'modulo_4_1',
        titulo: 'Bancos e Contas',
        questoes: [
          {
            id: 'q_4_1_1',
            dificuldade: 'facil',
            pergunta: 'Para que serve um banco?',
            opcoes: [
              'A) Apenas para guardar moedas',
              'B) Para guardar o dinheiro das pessoas com segurança',
              'C) Para fabricar dinheiro',
              'D) Para dar doces'
            ],
            respostaCorreta: 1,
            explicacao: 'Bancos são instituições seguras para guardar dinheiro, fazer pagamentos e outros serviços financeiros.'
          },
          {
            id: 'q_4_1_2',
            dificuldade: 'medio',
            pergunta: 'O que acontece com o dinheiro quando ele está em uma conta poupança no banco?',
            opcoes: [
              'A) Ele diminui com o tempo',
              'B) Ele fica parado, sem mudar',
              'C) Ele pode render juros e aumentar um pouquinho',
              'D) Ele some'
            ],
            respostaCorreta: 2,
            explicacao: 'A poupança é um tipo de investimento onde o banco te paga uma pequena quantia (juros) para deixar seu dinheiro lá.'
          },
          {
            id: 'q_4_1_3',
            dificuldade: 'dificil',
            pergunta: 'Qual a principal desvantagem de guardar todo o dinheiro em casa?',
            opcoes: [
              'A) É mais seguro',
              'B) Pode ser perdido ou roubado e não rende juros',
              'C) Rende mais que no banco',
              'D) É mais fácil de gastar'
            ],
            respostaCorreta: 1,
            explicacao: 'Guardar dinheiro em casa oferece riscos de segurança e faz com que ele perca valor com o tempo por causa da inflação.'
          }
        ]
      }
    }
  },
  {
    id: 'trilha_05',
    titulo: 'Fazendo o Dinheiro Trabalhar',
    descricao: 'Uma introdução simples ao mundo dos investimentos e como eles ajudam seu dinheiro a crescer.',
    ordem: 5,
    icone: null,
    progresso: 0,
    bloqueada: true,
    historia: {
      titulo: 'O Dinheiro que Trabalha',
      conteudo: `Carlos tinha R$ 100,00 guardados na poupança e estava feliz. 💰

"Meu dinheiro está crescendo!", ele pensava. "R$ 100 viraram R$ 105!"

Mas seu tio, que era economista, perguntou: "Carlos, você sabia que seu dinheiro pode trabalhar ainda mais?"

"Como assim trabalhar?", Carlos ficou confuso.

"É que existem diferentes formas de investir. A poupança é segura, mas rende pouco. Existem outros investimentos que podem render mais!"

"Mas não é perigoso?", perguntou Carlos preocupado.

"Boa pergunta! Quanto maior o risco, maior pode ser o retorno. Mas também maior pode ser a perda."

O tio explicou os tipos de investimento:
🏦 Poupança: Segura, rende pouco
📈 Ações: Mais arriscado, pode render muito
🏢 Fundos: Diversificados, risco médio
💎 Ouro: Proteção contra inflação

"E o que é diversificar?", perguntou Carlos.

"É não colocar todos os ovos na mesma cesta! Se você investir em várias coisas diferentes, se uma não der certo, as outras podem compensar."

"Então é melhor investir um pouco em cada coisa?"

"Exato! E sempre com a ajuda de um adulto e de um profissional. Investir é como plantar uma semente: você cuida, espera, e colhe os frutos no futuro!"

Carlos ficou empolgado: "Vou aprender mais sobre investimentos! Quero que meu dinheiro trabalhe para mim!"

E assim Carlos descobriu que o dinheiro pode ser um trabalhador incansável! 💪💰`,
      duracao: '6 min',
      concluida: false
    },
    modulos: {
      modulo_5_1: {
        id: 'modulo_5_1',
        titulo: 'O Que é Investir?',
        questoes: [
          {
            id: 'q_5_1_1',
            dificuldade: 'facil',
            pergunta: 'Investir significa...',
            opcoes: [
              'A) Esconder o dinheiro',
              'B) Gastar em coisas caras',
              'C) Aplicar o dinheiro para que ele gere mais dinheiro',
              'D) Doar todo o dinheiro'
            ],
            respostaCorreta: 2,
            explicacao: 'Investir é usar seu dinheiro para comprar ativos que podem crescer de valor ou gerar renda, como juros.'
          },
          {
            id: 'q_5_1_2',
            dificuldade: 'medio',
            pergunta: 'Por que investir é geralmente melhor do que apenas deixar na poupança?',
            opcoes: [
              'A) Porque é mais arriscado',
              'B) Porque não há diferença',
              'C) Porque o potencial de rendimento é maior',
              'D) Porque o dinheiro fica preso'
            ],
            respostaCorreta: 2,
            explicacao: 'Investimentos geralmente oferecem a possibilidade de um retorno financeiro maior do que a poupança a longo prazo.'
          },
          {
            id: 'q_5_1_3',
            dificuldade: 'dificil',
            pergunta: 'O que significa "diversificar" os investimentos?',
            opcoes: [
              'A) Colocar todo o dinheiro em um único lugar',
              'B) Gastar o dinheiro em coisas diversas',
              'C) Dividir o dinheiro em diferentes tipos de investimentos',
              'D) Nunca investir'
            ],
            respostaCorreta: 2,
            explicacao: 'Diversificar é uma estratégia para reduzir os riscos. Se um investimento não for bem, os outros podem compensar.'
          }
        ]
      }
    }
  }
];

// Função auxiliar para buscar questões de um módulo específico
export const getQuestoesByModulo = (trilhaId, moduloId) => {
  const trilha = TRILHAS_MOCADAS.find(t => t.id === trilhaId);
  if (!trilha || !trilha.modulos || !trilha.modulos[moduloId]) {
    return [];
  }
  return trilha.modulos[moduloId].questoes;
};

// Função auxiliar para buscar uma questão específica
export const getQuestaoById = (questaoId) => {
  for (const trilha of TRILHAS_MOCADAS) {
    if (trilha.modulos) {
      for (const moduloId in trilha.modulos) {
        const modulo = trilha.modulos[moduloId];
        const questao = modulo.questoes.find(q => q.id === questaoId);
        if (questao) {
          return {
            ...questao,
            trilhaId: trilha.id,
            moduloId,
            trilhaTitulo: trilha.titulo,
            moduloTitulo: modulo.titulo
          };
        }
      }
    }
  }
  return null;
};