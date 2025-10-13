# **Backlog do Produto \- Aplicativo FinGo**

Versão: 1.0  
Data: 02 de Setembro de 2025  
Líderes: Thamy Mellysa (Qualidade), Vinicius Mendes (Técnico)

## **1\. Introdução**

Este documento representa o Backlog do Produto (Product Backlog) para o projeto FinGo. Ele contém a lista de todas as funcionalidades, melhorias e tarefas técnicas necessárias para construir o aplicativo, organizadas em Épicos e priorizadas na ordem em que devem ser desenvolvidas.

Cada item principal é uma **História de Usuário (User Story)**, que descreve uma funcionalidade do ponto de vista do usuário final, acompanhada de tarefas técnicas específicas para as equipes de Frontend e Backend.

## **ÉPICO 1: Autenticação e Onboarding do Usuário**

*Objetivo: Permitir que um novo usuário se cadastre, personalize seu perfil e acesse o aplicativo de forma segura, e que um usuário existente possa fazer login.*

### **US-01: Início da Jornada (Tela de Boas-Vindas)**

**Como um** novo usuário, **eu quero** ver uma tela de boas-vindas com a opção de começar, **para que** eu me sinta motivado a iniciar minha jornada de aprendizado.

* **Prioridade:** Essencial  
* **Status:** Concluído ✅  
* **Tarefas Técnicas:**  
  * Front-End: Construir a UI da tela de Boas-Vindas.  
  * Front-End: Implementar a navegação do botão "Começar" para a tela de Login.

### **US-02: Criação de Conta (Tela de Cadastro)**

**Como um** novo usuário, **eu quero** criar uma conta com meu nome, e-mail e senha, **para que** eu possa ter um perfil e salvar meu progresso no aplicativo.

* **Prioridade:** Essencial  
* **Status:** Concluído (UI) / A Fazer (Lógica)  
* **Tarefas Técnicas:**  
  * Front-End: Construir a UI da tela de Cadastro com os campos necessários. (✅)  
  * Backend (Ana): Implementar a função registerUser(nome, email, senha) que cria o usuário no Firebase Auth e salva os dados na coleção users do Firestore.  
  * Integração (Vini/Thamy): Conectar o formulário da UI à função registerUser do serviço.

### **US-03: Acesso à Conta (Tela de Login)**

**Como um** usuário já cadastrado, **eu quero** fazer login com meu e-mail e senha, **para que** eu possa continuar meu aprendizado de onde parei.

* **Prioridade:** Essencial  
* **Status:** Concluído (UI) / A Fazer (Lógica)  
* **Tarefas Técnicas:**  
  * Front-End: Construir a UI da tela de Login. (✅)  
  * Backend (Ana): Implementar a função loginUser(email, senha) que valida as credenciais no Firebase Auth.  
  * Integração (Vini/Thamy): Conectar o formulário de login à função loginUser.

### **US-04: Recuperação de Acesso (Fluxo de Recuperar Senha)**

**Como um** usuário que esqueceu a senha, **eu quero** um processo para redefinir minha senha de forma segura, **para que** eu não perca o acesso à minha conta e ao meu progresso.

* **Prioridade:** Essencial  
* **Status:** Concluído (UI) / A Fazer (Lógica)  
* **Tarefas Técnicas:**  
  * Front-End: Construir as UIs das telas "Recuperar Senha" e "Criar Nova Senha". (✅)  
  * Backend (Ana): Implementar a função recoverPassword(email) que utiliza o sendPasswordResetEmail do Firebase.  
  * Integração (Vini/Thamy): Conectar os formulários às funções de serviço correspondentes.

### **US-05: Personalização Inicial (Tela de Configuração de Perfil)**

**Como um** novo usuário, **eu quero** configurar meu perfil com minha idade e um avatar, **para que** a minha experiência no aplicativo seja personalizada.

* **Prioridade:** Alta  
* **Status:** A Fazer  
* **Tarefas Técnicas:**  
  * Front-End: Construir a UI da tela de Configuração de Perfil.  
  * Backend (Ana): Criar a função atualizarPerfil(userId, dados) para salvar as informações de idade e avatar no documento do usuário no Firestore.  
  * Integração (Vini/Thamy): Conectar a seleção de avatar e o campo de idade à função de atualização.

## **ÉPICO 2: Jornada de Aprendizado (Core do App)**

*Objetivo: Criar a experiência central de aprendizado gamificado, onde o usuário navega por trilhas, consome conteúdo e testa seus conhecimentos.*

### **US-06: Visualização das Trilhas (Tela Principal \- Home)**

**Como um** usuário, **eu quero** ver um mapa visual com todas as trilhas de aprendizado, **para que** eu possa entender meu caminho e escolher por onde começar.

* **Prioridade:** Essencial  
* **Status:** A Fazer  
* **Tarefas Técnicas:**  
  * Backend (Wilker): Implementar a função buscarTrilhas() que lê e retorna todos os documentos da coleção trilhas do Firestore.  
  * Frontend (Asaph/Adryan): Construir a UI da HomeScreen que exibe as trilhas em um formato de mapa visual.  
  * Integração (Vini/Thamy): Conectar a HomeScreen para que ela chame a função buscarTrilhas() e exiba os dados reais.

### **US-07: Detalhes do Módulo (Tela de Introdução de Módulo)**

**Como um** usuário, **eu quero** ver uma tela com os detalhes de um módulo antes de iniciá-lo, **para que** eu saiba o que vou aprender.

* **Prioridade:** Essencial  
* **Status:** A Fazer  
* **Tarefas Técnicas:**  
  * Backend (Wilker): Implementar a função buscarModulos(trilhaId) que retorna os módulos de uma trilha específica.  
  * Frontend (Asaph/Adryan): Construir a UI da ModuleIntroScreen.  
  * Integração (Vini/Thamy): Fazer com que, ao clicar em um módulo na HomeScreen, a ModuleIntroScreen seja aberta com os dados corretos daquele módulo.

### **US-08: Lista de Desafios (Tela de Desafios)**

**Como um** usuário, **eu quero** ver uma lista de fases e questões dentro de um módulo, **para que** eu possa escolher qual desafio completar.

* **Prioridade:** Essencial  
* **Status:** A Fazer  
* **Tarefas Técnicas:**  
  * Backend (Wilker): Implementar a função buscarQuestoes(moduloId).  
  * Frontend (Asaph/Adryan): Construir a UI da DesafiosScreen, que agrupa as questões em "Fases".  
  * Integração (Vini/Thamy): Conectar a tela para exibir as questões do módulo selecionado.

### **US-09: Interação com as Questões (Tela de Questão)**

**Como um** usuário, **eu quero** responder a perguntas de múltipla escolha e receber feedback imediato, **para que** eu possa testar meu conhecimento de forma interativa.

* **Prioridade:** Essencial  
* **Status:** A Fazer  
* **Tarefas Técnicas:**  
  * Frontend (Asaph/Adryan): Construir a UI da QuestaoScreen.  
  * Lógica (Thamy): Desenvolver a função verificarResposta(respostaUsuario, respostaCorreta) que retorna true ou false.  
  * Integração (Vini): Conectar a seleção de uma opção na UI à função de verificação e exibir o feedback visual (correto/incorreto).

### **US-10: Feedback de Desempenho (Tela de Resultado)**

**Como um** usuário, **eu quero** ver um resumo do meu desempenho após completar uma fase, **para que** eu me sinta recompensado e motivado a continuar.

* **Prioridade:** Essencial  
* **Status:** A Fazer  
* **Tarefas Técnicas:**  
  * Backend (Wilker): Implementar a função salvarConclusaoModulo(userId, moduloId, pontuacao).  
  * Frontend (Asaph/Adryan): Construir a UI da ResultadoScreen.  
  * Integração (Vini/Thamy): Orquestrar o fluxo: ao final de uma fase, chamar a função salvarConclusaoModulo e exibir os dados de desempenho (acertos, erros) na tela de resultado.

## **ÉPICO 3: Gerenciamento e Configurações**

*Objetivo: Permitir que o usuário gerencie seu perfil, configure notificações e acesse informações institucionais.*

### **US-11: Gerenciamento do Perfil (Tela de Perfil)**

**Como um** usuário, **eu quero** ver e editar as informações do meu perfil, **para que** eu possa manter meus dados atualizados e gerenciar minha conta.

* **Prioridade:** Média  
* **Status:** A Fazer  
* **Tarefas Técnicas:**  
  * Backend (Ana): Implementar a função buscarDadosUsuario(userId) e atualizarDadosUsuario(userId, novosDados).  
  * Frontend (Asaph/Adryan): Construir a UI da PerfilScreen e suas sub-telas (Notificações, Privacidade, etc.).  
  * Integração (Vini/Thamy): Conectar a tela de perfil para buscar e exibir os dados do usuário logado e permitir a edição, chamando a função de atualização.