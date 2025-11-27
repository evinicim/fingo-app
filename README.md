# 🦊 FinGo - Educação Financeira Gamificada

<div align="center">

![FinGo Logo](./src/assets/images/logoFinGo.png)

**Aplicativo de educação financeira gamificada para jovens**

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.13-000020?logo=expo)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?logo=firebase)](https://firebase.google.com/)

</div>

---

## 📱 Sobre o Projeto

O **FinGo** é um aplicativo mobile desenvolvido para ensinar educação financeira de forma gamificada e interativa para jovens. Através de trilhas de aprendizado, desafios, quizzes e histórias envolventes, os usuários aprendem sobre dinheiro, poupança, investimentos e muito mais!

### ✨ Principais Funcionalidades

- 🎯 **Trilhas de Aprendizado**: 8 trilhas completas sobre educação financeira
- 📖 **Histórias Interativas**: Conteúdo educativo em formato de histórias
- 🎮 **Gamificação**: Sistema de XP, badges e progresso
- 📹 **Vídeos Educativos**: Conteúdo em vídeo integrado
- ❓ **Quizzes e Desafios**: Teste seus conhecimentos
- 📊 **Acompanhamento de Progresso**: Visualize seu desenvolvimento
- 🔔 **Notificações Personalizadas**: Configure suas preferências

---

## 👥 Equipe de Desenvolvimento

### Projeto Integrador de Desenvolvimento Mobile

Este aplicativo faz parte do **Projeto Integrador de Desenvolvimento Mobile** do curso de Engenharia de Software. A iniciativa conta com o empenho de toda a equipe FinGo e orientação acadêmica dedicada.

- **Adryan Winícius Sá Aragão**
- **Ana Luiza Rodrigues de Oliveira**
- **Asaph Gabriel Sousa dos Santos Felix**
- **Julio Cesar Andrade Bezerra**
- **Jennifer Cristina Rodrigues da Silva Costa**
- **Thamy Mellysa Lemes Mesquita Ferreira**
- **Vinícius Mendes Correia**
- **Wilker Gabriel Araujo do Nascimento**
- **Luís Felipe dos Santos Rocha**

**Orientação:** Osmam Brás de Souto

### Contribuições

Este projeto foi desenvolvido como parte de um trabalho acadêmico, com foco em criar uma solução educacional inovadora para educação financeira de jovens.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre telas
- **Expo Fonts** - Gerenciamento de fontes customizadas

### Backend & Serviços
- **Firebase Authentication** - Autenticação de usuários
- **Cloud Firestore** - Banco de dados NoSQL
- **Firebase Storage** - Armazenamento de arquivos
- **Firebase Admin SDK** - Scripts de administração

### Bibliotecas Principais
- `@react-navigation/native` - Navegação
- `firebase` - SDK do Firebase
- `@react-native-async-storage/async-storage` - Armazenamento local
- `react-native-svg` - Gráficos e ícones SVG
- `expo-font` - Fontes customizadas (Outfit)

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Conta no [Firebase](https://firebase.google.com/)
- [Git](https://git-scm.com/)

---

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/fingo-app.git
cd fingo-app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 4. Execute o projeto

```bash
npm start
```

Ou para uma plataforma específica:

```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### 5. Popule o Firestore (opcional)

Para popular o banco de dados com dados iniciais:

```bash
cd scripts
node populateFirestore.js
```

---

## 📁 Estrutura do Projeto

```
fingo-app/
├── src/
│   ├── assets/          # Imagens, fontes e recursos
│   ├── components/      # Componentes reutilizáveis
│   ├── docs/            # Documentação e prompts
│   ├── navigation/      # Configuração de navegação
│   ├── screens/         # Telas do aplicativo
│   └── services/       # Serviços (Firebase, cache, etc.)
├── scripts/             # Scripts de administração
├── app.json            # Configuração do Expo
├── package.json        # Dependências do projeto
└── README.md           # Este arquivo
```

---

## 🎯 Funcionalidades Principais

### Trilhas de Aprendizado
- **Trilha 01**: O Mundo do Dinheiro
- **Trilha 02**: Para Onde Vai a Mesada?
- **Trilha 03**: O Poder de Poupar
- **Trilha 04**: Onde o Dinheiro Mora?
- **Trilha 05**: Fazendo o Dinheiro Trabalhar
- **Trilha 06**: Trabalhando e Impostos
- **Trilha 07**: Compras Inteligentes
- **Trilha 08**: Dinheiro Digital e Segurança

### Sistema de Gamificação
- Pontos de XP por atividades completadas
- Badges de conquistas
- Progresso visual por trilha
- Ranking e estatísticas pessoais

---

## 📝 Scripts Disponíveis

### Scripts de Administração

```bash
# Popular Firestore com dados iniciais
node scripts/populateFirestore.js

# Criar módulo de vídeo
node scripts/createVideoModule.js <trilha-id> <modulo-id> <titulo> <descricao>

# Atualizar URL de vídeo
node scripts/updateVideoUrl.js <modulo-id> <url-do-video>

# Upload de vídeo para Firebase Storage
node scripts/uploadVideo.js <caminho-do-video> <trilha-id> <modulo-id>
```

---

## 🔐 Segurança

- Autenticação via Firebase Authentication
- Dados sensíveis armazenados de forma segura
- Política de privacidade e termos de uso implementados
- Conformidade com LGPD (Lei Geral de Proteção de Dados)

---

## 📄 Licença

Este projeto é privado e desenvolvido para fins educacionais.

---

## 🤝 Contribuindo

Este é um projeto acadêmico. Para contribuições, entre em contato com a equipe de desenvolvimento.

---

## 📧 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através dos canais oficiais.

---

<div align="center">

**Desenvolvido com ❤️ pela equipe FinGo**

![Version](https://img.shields.io/badge/version-1.0.0-blue)

</div>




