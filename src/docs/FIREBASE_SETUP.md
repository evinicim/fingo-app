# 🔥 Configuração do Firebase - FinGo App

## 📋 Passo 1: Criar arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 🔑 Passo 2: Obter Credenciais do Firebase

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Configurações do Projeto** (ícone de engrenagem)
4. Role até **Seus apps** e selecione o app Web
5. Copie as credenciais e cole no arquivo `.env`

## 🗄️ Passo 3: Configurar Firestore Database

### 3.1. Criar o Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Modo de produção** (ou teste para desenvolvimento)
4. Selecione a localização (ex: `southamerica-east1`)

### 3.2. Estrutura de Coleções

O app usa a seguinte estrutura no Firestore:

#### **Coleção: `users`**

```
users/
  └── {userId}/
      ├── email: string
      ├── nome: string
      ├── dataCriacao: string (ISO)
      ├── perfilCompleto: boolean
      ├── avatar: object { id, icon, name }
      ├── idade: number
      ├── nivelConhecimento: string ("iniciante" | "intermediario" | "avancado")
      ├── trilhasConcluidas: array
      ├── questoesCompletadas: array
      ├── pontuacaoTotal: number
      ├── nivel: number
      ├── xp: number
      ├── notificationPreferences: object {
      │   ├── desafiosDiarios: boolean
      │   ├── lembreteEstudos: boolean
      │   ├── novosModulos: boolean
      │   ├── badgesPremios: boolean
      │   └── progressoSemanal: boolean
      └── }
```

#### **Coleção: `progress`** (opcional - para histórico)

```
progress/
  └── {userId}/
      └── trilhas/
          └── {trilhaId}/
              ├── historiaConcluida: boolean
              ├── questoesCompletadas: array
              └── dataAtualizacao: string (ISO)
```

### 3.3. Regras de Segurança do Firestore

No Firebase Console, vá em **Firestore Database > Regras** e configure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para a coleção users
    match /users/{userId} {
      // Permite leitura e escrita apenas para o próprio usuário
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para a coleção progress
    match /progress/{userId}/{document=**} {
      // Permite leitura e escrita apenas para o próprio usuário
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔐 Passo 4: Configurar Authentication

1. No Firebase Console, vá em **Authentication**
2. Clique em **Começar**
3. Ative o método **E-mail/senha**
4. (Opcional) Configure outros métodos de login

## 📱 Passo 5: Testar a Configuração

Após configurar tudo:

1. Reinicie o servidor Expo:
   ```bash
   npx expo start --clear
   ```

2. Teste o registro de um novo usuário
3. Verifique no Firebase Console se:
   - O usuário foi criado em **Authentication**
   - O documento foi criado em **Firestore > users**

## 🐛 Solução de Problemas

### Erro: "Expected first argument to collection() to be a CollectionReference"

**Causa:** O Firestore não foi inicializado corretamente.

**Solução:**
1. Verifique se o arquivo `.env` existe e tem as credenciais corretas
2. Verifique se `firebaseConfig.js` exporta `db`:
   ```javascript
   export const db = getFirestore(app);
   ```
3. Reinicie o servidor: `npx expo start --clear`

### Erro: "Permission denied"

**Causa:** As regras de segurança do Firestore estão bloqueando o acesso.

**Solução:**
1. Verifique as regras no Firebase Console
2. Certifique-se de que o usuário está autenticado
3. Verifique se as regras permitem acesso ao documento

### Erro: "Firebase: Error (auth/network-request-failed)"

**Causa:** Problema de conexão com o Firebase.

**Solução:**
1. Verifique sua conexão com a internet
2. Verifique se as credenciais do Firebase estão corretas
3. Verifique se o projeto Firebase está ativo

## 📚 Documentação Adicional

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Native Firebase](https://rnfirebase.io/)

## ✅ Checklist de Configuração

- [ ] Arquivo `.env` criado com credenciais
- [ ] Firestore Database criado
- [ ] Coleção `users` configurada
- [ ] Regras de segurança configuradas
- [ ] Authentication habilitado (E-mail/senha)
- [ ] Servidor Expo reiniciado
- [ ] Teste de registro funcionando
- [ ] Dados salvos no Firestore

---

**Última atualização:** $(date)
**Versão do Firebase:** 10.x
**Versão do Expo:** 51.x

