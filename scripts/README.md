# 🚀 Scripts do FinGo

## 📦 Script de População do Firestore

Este script popula automaticamente o Firestore com dados iniciais.

### 🎯 O que será criado:

- ✅ **5 Trilhas** completas
- ✅ **8 Módulos** (história, vídeo, quiz, desafio)
- ✅ **2 Histórias** completas
- ✅ **3 Questões** com alternativas
- ✅ **4 Badges** para conquistas

---

## 🔧 Como Usar:

### 1️⃣ Instalar Dependências:

```bash
cd scripts
npm install
```

### 2️⃣ Executar o Script:

```bash
npm run populate
```

Ou diretamente:

```bash
node populateFirestore.js
```

---

## 📋 Pré-requisitos:

- ✅ Arquivo `.env` configurado na raiz do projeto
- ✅ Firestore Database criado no Firebase Console
- ✅ Regras de segurança configuradas

---

## 🗄️ Estrutura Criada:

### **Trilhas:**
1. Fundamentos Financeiros 💰
2. Poupança e Investimentos 📈
3. Planejamento Financeiro 📊
4. Empreendedorismo 🚀
5. Finanças Avançadas 🎓

### **Módulos por Trilha:**
- História introdutória
- Vídeo educativo
- Quiz de conhecimento
- Desafio prático

### **Badges:**
- 🎯 Primeiro Passo (Complete 1 trilha)
- 📚 Estudioso (10 questões corretas)
- 🔥 Dedicado (7 dias consecutivos)
- 👑 Mestre Financeiro (Todas as trilhas)

---

## ⚠️ Importante:

- Execute o script apenas UMA vez
- Se precisar reexecutar, delete as coleções no Firestore primeiro
- O script não sobrescreve dados existentes

---

## 🐛 Solução de Problemas:

### Erro: "Cannot find module"
```bash
cd scripts
npm install
```

### Erro: "Firebase config not found"
Verifique se o arquivo `.env` existe na raiz do projeto.

### Erro: "Permission denied"
Verifique as regras de segurança do Firestore.

---

## 📝 Personalização:

Para adicionar mais dados, edite o arquivo `populateFirestore.js`:

- **Trilhas**: Array `trilhas`
- **Módulos**: Array `modulos`
- **Histórias**: Array `historias`
- **Questões**: Array `questoes`
- **Badges**: Array `badges`

---

**Criado por:** FinGo Team
**Última atualização:** 2025-10-14

