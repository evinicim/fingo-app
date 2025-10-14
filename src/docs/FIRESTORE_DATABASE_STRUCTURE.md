# 🗄️ Estrutura do Banco de Dados Firestore - FinGo App

## 📊 Visão Geral das Coleções

O banco de dados do FinGo possui as seguintes coleções:

1. **users** - Dados dos usuários
2. **moduloId** - Módulos de aprendizado
3. **progressoUsuario** - Progresso individual dos usuários
4. **questao** - Questões/perguntas dos módulos
5. **trilhaId** - Trilhas de aprendizado

---

## 📋 Estrutura Atual das Coleções

### 1. 👤 **Coleção: `users`**

**Propósito:** Armazenar dados de perfil e progresso dos usuários.

**Estrutura Atual:**
```javascript
users/{userId}
├── avatarId: number (1)
├── dataCadastro: string (ISO) "2025-10-03T19:11:33.653Z"
├── idade: number (25)
├── nivel: number (1)
├── nivelConhecimento: string ("iniciante" | "intermediario" | "avancado")
├── nomeCompleto: string ("goias")
├── perfilCompleto: boolean (true)
├── pontuacaoTotal: number (0)
├── questoesCompletadas: array []
├── trilhasConcluidas: array []
├── ultimoAcesso: string (ISO) "2025-10-03T19:11:46.058Z"
└── xp: number (0)
```

**Campos Faltantes (a adicionar):**
- `email`: string
- `nome`: string (separado de nomeCompleto)
- `avatar`: object { id, icon, name }
- `notificationPreferences`: object
- `historiasCompletadas`: array
- `badges`: array
- `streak`: number (dias consecutivos)
- `dataCriacao`: string (ISO)

---

### 2. 📚 **Coleção: `moduloId`**

**Propósito:** Armazenar informações dos módulos de aprendizado.

**Estrutura Atual:**
```javascript
moduloId/{moduloId}
├── descricao: string ("facil")
├── ordem: number (1)
├── titulo: string ("sonho")
└── trilhaId: string ("trilha_01")
```

**✅ Estrutura está boa, mas sugestões:**
- Adicionar `tipo`: string ("video" | "historia" | "quiz" | "desafio")
- Adicionar `duracao`: number (em minutos)
- Adicionar `pontos`: number (pontos ao completar)
- Adicionar `urlConteudo`: string (URL do vídeo/história)
- Adicionar `thumbnail`: string (URL da imagem)
- Adicionar `prerequisitos`: array (IDs de módulos anteriores)

---

### 3. 📈 **Coleção: `progressoUsuario`**

**Propósito:** Rastrear o progresso dos usuários em tempo real.

**Estrutura Atual:**
```javascript
progressoUsuario/{progressoId}
├── modulosCompletos: string ("2")
├── pontuacaoTotal: number (500)
├── ultimoAcesso: timestamp
└── userId: string ("Use_22")
```

**⚠️ PROBLEMA:** Esta coleção está redundante com `users`. 

**Sugestão:** Integrar com a coleção `users` ou reestruturar para:
```javascript
progressoUsuario/{userId}/trilhas/{trilhaId}
├── modulosCompletos: array [moduloId1, moduloId2]
├── questoesCompletadas: array [questaoId1, questaoId2]
├── historiasCompletadas: array [historiaId1, historiaId2]
├── pontuacaoTrilha: number
├── progresso: number (0-100)
├── dataInicio: timestamp
├── dataConclusao: timestamp (null se não concluído)
└── ultimoAcesso: timestamp
```

---

### 4. ❓ **Coleção: `questao`**

**Propósito:** Armazenar perguntas/questões dos módulos.

**Estrutura Atual:**
```javascript
questao/{questaoId}
├── enunciado: string
├── moduloId: string
├── opcoes: string
├── questaoId: string
└── respostaCorreta: string
```

**⚠️ PROBLEMA:** Campo `opcoes` está como string, deveria ser array.

**Estrutura Sugerida:**
```javascript
questao/{questaoId}
├── enunciado: string
├── moduloId: string
├── trilhaId: string (para facilitar queries)
├── opcoes: array [
│   { id: "A", texto: "Opção A" },
│   { id: "B", texto: "Opção B" },
│   { id: "C", texto: "Opção C" },
│   { id: "D", texto: "Opção D" }
│ ]
├── respostaCorreta: string ("A" | "B" | "C" | "D")
├── explicacao: string (explicação da resposta)
├── dificuldade: string ("facil" | "medio" | "dificil")
├── pontos: number (pontos ao acertar)
├── ordem: number (ordem dentro do módulo)
└── tipo: string ("multipla_escolha" | "verdadeiro_falso")
```

---

### 5. 🎯 **Coleção: `trilhaId`**

**Propósito:** Armazenar informações das trilhas de aprendizado.

**Estrutura Atual:**
```javascript
trilhaId/{trilhaId}
├── descricao: string ("facil")
├── ordem: number (1)
├── titulo: string ("sonho")
└── trilhaID: string ("trilha_01")
```

**✅ Estrutura básica está boa, mas adicionar:**
- `icone`: string (emoji ou URL)
- `cor`: string (cor da trilha)
- `totalModulos`: number
- `totalQuestoes`: number
- `pontosTotal`: number
- `duracao`: number (tempo estimado em minutos)
- `prerequisitos`: array (IDs de trilhas anteriores)
- `ativa`: boolean (se está disponível)

---

## 🆕 Novas Coleções Necessárias

### 6. 📖 **Coleção: `historias`** (NOVA)

**Propósito:** Armazenar o conteúdo das histórias de cada módulo.

```javascript
historias/{historiaId}
├── moduloId: string
├── trilhaId: string
├── titulo: string
├── conteudo: string (texto da história)
├── personagens: array [
│   { nome: "Personagem 1", avatar: "emoji" }
│ ]
├── duracao: number (tempo estimado de leitura em minutos)
├── urlAudio: string (URL do áudio narrado - opcional)
├── imagens: array [url1, url2] (imagens da história)
├── ordem: number
└── pontos: number (pontos ao completar)
```

---

### 7. 🎥 **Coleção: `videos`** (NOVA)

**Propósito:** Armazenar informações dos vídeos educativos.

```javascript
videos/{videoId}
├── moduloId: string
├── trilhaId: string
├── titulo: string
├── descricao: string
├── urlVideo: string (URL do vídeo - YouTube, Vimeo, Firebase Storage)
├── thumbnail: string (URL da thumbnail)
├── duracao: number (duração em segundos)
├── transcricao: string (transcrição do vídeo - opcional)
├── legendas: string (URL do arquivo de legendas - opcional)
├── ordem: number
├── pontos: number (pontos ao assistir)
└── visualizacoes: number (contador de views)
```

---

### 8. 🏆 **Coleção: `desafios`** (NOVA)

**Propósito:** Desafios especiais e missões diárias.

```javascript
desafios/{desafioId}
├── titulo: string
├── descricao: string
├── tipo: string ("diario" | "semanal" | "especial")
├── icone: string (emoji)
├── requisitos: object {
│   ├── tipo: string ("completar_trilha" | "responder_questoes" | "dias_consecutivos")
│   ├── quantidade: number
│   └── trilhaId: string (opcional)
│ }
├── recompensa: object {
│   ├── xp: number
│   ├── pontos: number
│   └── badge: string (ID do badge)
│ }
├── dataInicio: timestamp
├── dataFim: timestamp
├── ativo: boolean
└── ordem: number
```

---

### 9. 🎖️ **Coleção: `badges`** (NOVA)

**Propósito:** Badges/conquistas que os usuários podem ganhar.

```javascript
badges/{badgeId}
├── nome: string
├── descricao: string
├── icone: string (emoji ou URL)
├── cor: string
├── requisito: object {
│   ├── tipo: string ("completar_trilhas" | "questoes_corretas" | "dias_consecutivos")
│   ├── quantidade: number
│   └── detalhes: string
│ }
├── raridade: string ("comum" | "raro" | "epico" | "lendario")
├── pontos: number
└── ordem: number
```

---

### 10. 📊 **Coleção: `ranking`** (NOVA)

**Propósito:** Ranking global e por trilha.

```javascript
ranking/{rankingId}
├── userId: string
├── nomeUsuario: string
├── avatarId: number
├── pontuacaoTotal: number
├── nivel: number
├── trilhasConcluidas: number
├── questoesCorretas: number
├── posicao: number
├── periodo: string ("semanal" | "mensal" | "geral")
└── ultimaAtualizacao: timestamp
```

---

### 11. 📝 **Coleção: `feedback`** (NOVA)

**Propósito:** Feedback dos usuários sobre questões e conteúdo.

```javascript
feedback/{feedbackId}
├── userId: string
├── tipo: string ("questao" | "historia" | "video" | "geral")
├── itemId: string (ID da questão, história, etc)
├── rating: number (1-5)
├── comentario: string
├── data: timestamp
└── respondido: boolean
```

---

## 🔄 Subcoleções Recomendadas

### **users/{userId}/progresso/{trilhaId}**

```javascript
users/{userId}/progresso/{trilhaId}
├── modulosCompletos: array
├── questoesCompletadas: array
├── historiasCompletadas: array
├── videosAssistidos: array
├── pontuacaoTrilha: number
├── progresso: number (0-100)
├── dataInicio: timestamp
├── dataConclusao: timestamp
└── ultimoAcesso: timestamp
```

### **users/{userId}/badges/{badgeId}**

```javascript
users/{userId}/badges/{badgeId}
├── badgeId: string
├── dataConquista: timestamp
└── visualizado: boolean
```

### **users/{userId}/desafios/{desafioId}**

```javascript
users/{userId}/desafios/{desafioId}
├── desafioId: string
├── progresso: number (0-100)
├── concluido: boolean
├── dataConclusao: timestamp
└── recompensaRecebida: boolean
```

---

## 📐 Estrutura Completa Recomendada

```
firestore/
├── users/
│   ├── {userId}/
│   │   ├── (dados do usuário)
│   │   ├── progresso/
│   │   │   └── {trilhaId}/
│   │   ├── badges/
│   │   │   └── {badgeId}/
│   │   └── desafios/
│   │       └── {desafioId}/
│   │
├── trilhaId/
│   └── {trilhaId}/
│
├── moduloId/
│   └── {moduloId}/
│
├── historias/
│   └── {historiaId}/
│
├── videos/
│   └── {videoId}/
│
├── questao/
│   └── {questaoId}/
│
├── desafios/
│   └── {desafioId}/
│
├── badges/
│   └── {badgeId}/
│
├── ranking/
│   └── {rankingId}/
│
└── feedback/
    └── {feedbackId}/
```

---

## 🔧 Ações Necessárias

### ✅ **Manter Como Está:**
- `trilhaId` (adicionar campos sugeridos)
- `moduloId` (adicionar campos sugeridos)

### ⚠️ **Modificar:**
1. **`users`**: Adicionar campos faltantes (email, nome, avatar, notificationPreferences)
2. **`questao`**: Mudar `opcoes` de string para array de objetos
3. **`progressoUsuario`**: Reestruturar como subcoleção de `users`

### 🆕 **Criar:**
1. `historias` - Para conteúdo narrativo
2. `videos` - Para vídeos educativos
3. `desafios` - Para missões e desafios
4. `badges` - Para conquistas
5. `ranking` - Para leaderboard
6. `feedback` - Para avaliações dos usuários

---

## 🔐 Regras de Segurança Atualizadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar autenticação
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Função auxiliar para verificar se é o próprio usuário
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Coleção users
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
      
      // Subcoleções do usuário
      match /progresso/{trilhaId} {
        allow read, write: if isOwner(userId);
      }
      match /badges/{badgeId} {
        allow read, write: if isOwner(userId);
      }
      match /desafios/{desafioId} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Coleções públicas (somente leitura)
    match /trilhaId/{trilhaId} {
      allow read: if isAuthenticated();
      allow write: if false; // Apenas admin pode escrever
    }
    
    match /moduloId/{moduloId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    match /historias/{historiaId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    match /videos/{videoId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    match /questao/{questaoId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    match /desafios/{desafioId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    match /badges/{badgeId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    // Ranking - leitura pública, escrita apenas sistema
    match /ranking/{rankingId} {
      allow read: if isAuthenticated();
      allow write: if false; // Atualizado por Cloud Functions
    }
    
    // Feedback - usuário pode criar e ler próprio feedback
    match /feedback/{feedbackId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.userId);
    }
  }
}
```

---

## 📊 Índices Recomendados

Para melhorar a performance das queries, criar os seguintes índices compostos:

1. **questao**: `trilhaId` (Ascending) + `ordem` (Ascending)
2. **moduloId**: `trilhaId` (Ascending) + `ordem` (Ascending)
3. **historias**: `trilhaId` (Ascending) + `ordem` (Ascending)
4. **videos**: `trilhaId` (Ascending) + `ordem` (Ascending)
5. **ranking**: `periodo` (Ascending) + `pontuacaoTotal` (Descending)
6. **desafios**: `ativo` (Ascending) + `dataFim` (Ascending)

---

## 🚀 Próximos Passos

1. ✅ Atualizar campos da coleção `users`
2. ✅ Modificar estrutura da coleção `questao`
3. ✅ Criar novas coleções (historias, videos, desafios, badges, ranking, feedback)
4. ✅ Migrar dados de `progressoUsuario` para subcoleção de `users`
5. ✅ Atualizar regras de segurança
6. ✅ Criar índices compostos
7. ✅ Atualizar código do app para usar nova estrutura

---

**Última atualização:** 2025-10-14
**Versão:** 2.0
**Status:** Em desenvolvimento

