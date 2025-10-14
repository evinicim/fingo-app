# 🧩 PLANO DE TESTES – FinGo

## 📋 Informações do Documento
- **Projeto**: FinGo - Aplicativo de Educação Financeira
- **Versão do Documento**: 1.0
- **Data de Criação**: 13/10/2025
- **Responsável**: Equipe FinGo
- **Aprovado por**: [Nome do Professor/PO]

---

## 📝 TEMPLATE DE TESTE

### 🔄 FLUXO DE EVENTO – [Nome do Fluxo]

**NOME DA BRANCH**: `feature/nome-da-feature`  
**MÓDULO/TELA**: [Nome do Módulo/Tela]  
**PERFIL**: [Nome do Testador]  
**STATUS**: [Status Atual]  
**DATA DO TESTE**: [DD/MM/YYYY]  
**VERSÃO/BUILD**: [Ex: v1.0.0 ou commit hash]  
**AMBIENTE**: [Desenvolvimento/Homologação/Produção]  
**DISPOSITIVO/SO**: [Ex: Android 12, iOS 16, Emulador]

#### 📊 Legendas de Status
| Ícone | Status | Descrição |
|-------|--------|-----------|
| ✅ | Concluído | Teste passou sem falhas |
| ⚠️ | Em Ajuste | Teste iniciado com ajustes necessários |
| ❌ | Reprovado | Teste falhou / Bug encontrado |
| ⌛️ | Mapeando | Caso de teste ainda não iniciado |
| 🐞 | Erro Crítico | Travamento, exceção ou falha de sistema |

---

## 🎯 CASOS DE TESTE POR MÓDULO

### 1️⃣ CADASTRO DE USUÁRIO

**NOME DA BRANCH**: `feature/cadastro-usuario`  
**MÓDULO/TELA**: Cadastro de Usuário  
**PERFIL**: Jennifer  
**STATUS**: ⌛️ Mapeando

#### 🔄 Fluxo Principal
Usuário acessa a tela de cadastro → informa nome, e-mail e senha → aceita os termos → confirma → sistema valida e redireciona para a configuração de perfil.

#### 📋 Regras de Negócio
- **RN1**: O usuário deve preencher nome, e-mail e senha obrigatoriamente
- **RN2**: O sistema deve validar se o e-mail já está cadastrado
- **RN3**: Após confirmação dos termos, o sistema deve salvar o usuário e exibir a tela de configuração de perfil
- **RN4**: O cadastro está sendo salvo via Firebase Auth e Firestore
- **RN5**: A senha deve ter no mínimo 6 caracteres (padrão Firebase)
- **RN6**: O usuário deve aceitar os termos para prosseguir

#### 🧪 Casos de Teste Detalhados

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-CAD-001 | Cadastro com dados válidos | App instalado e conectado | 1. Abrir app<br>2. Clicar "Cadastrar"<br>3. Preencher nome válido<br>4. Preencher e-mail válido<br>5. Preencher senha válida (6+ chars)<br>6. Aceitar termos<br>7. Confirmar | Usuário cadastrado com sucesso e redirecionado para configuração de perfil | ⌛️ | - |
| CT-CAD-002 | Cadastro com e-mail duplicado | E-mail já existe no Firebase | 1. Tentar cadastrar e-mail existente<br>2. Preencher demais campos<br>3. Confirmar | Sistema exibe erro "E-mail já cadastrado" ou similar | ⌛️ | - |
| CT-CAD-003 | Cadastro sem aceitar termos | Tela de cadastro aberta | 1. Preencher todos os campos<br>2. Não aceitar termos<br>3. Tentar confirmar | Botão desabilitado ou alerta exibido | ⌛️ | - |
| CT-CAD-004 | Cadastro com campos vazios | Tela de cadastro aberta | 1. Deixar campos vazios<br>2. Tentar confirmar | Sistema exibe mensagens de erro em cada campo obrigatório | ⌛️ | - |
| CT-CAD-005 | Cadastro com e-mail inválido | Tela de cadastro aberta | 1. Preencher e-mail sem @<br>2. Tentar confirmar | Sistema exibe erro "E-mail inválido" | ⌛️ | - |
| CT-CAD-006 | Cadastro com senha curta | Tela de cadastro aberta | 1. Preencher senha com menos de 6 caracteres<br>2. Tentar confirmar | Sistema exibe erro "Senha deve ter no mínimo 6 caracteres" | ⌛️ | - |
| CT-CAD-007 | Cadastro sem conexão | App sem internet | 1. Desligar WiFi/dados<br>2. Tentar cadastrar | Sistema exibe mensagem de erro de conexão | ⌛️ | - |
| CT-CAD-008 | Duplo clique no botão cadastrar | Campos preenchidos corretamente | 1. Preencher dados<br>2. Clicar 2x rápido em "Cadastrar" | Apenas 1 cadastro é processado, botão desabilita após 1º clique | ⌛️ | - |

#### ✔️ Checklist de Validações

##### Campo Nome:
- [ ] ⌛️ Aceita nome com 2+ caracteres
- [ ] ⌛️ Rejeita campo vazio
- [ ] ⌛️ Aceita nomes compostos
- [ ] ⌛️ Exibe mensagem de erro clara
- [ ] ⌛️ Remove espaços extras

##### Campo E-mail:
- [ ] ⌛️ Aceita e-mail válido (ex: user@example.com)
- [ ] ⌛️ Rejeita e-mail sem @ (ex: userexample.com)
- [ ] ⌛️ Rejeita e-mail sem domínio (ex: user@)
- [ ] ⌛️ Rejeita campo vazio
- [ ] ⌛️ Exibe mensagem de erro clara
- [ ] ⌛️ Converte para minúsculas automaticamente

##### Campo Senha:
- [ ] ⌛️ Aceita senha com 6+ caracteres
- [ ] ⌛️ Rejeita senha com menos de 6 caracteres
- [ ] ⌛️ Campo exibe senha oculta por padrão
- [ ] ⌛️ Botão "mostrar senha" funciona
- [ ] ⌛️ Exibe feedback visual de senha forte/fraca

##### Checkbox Termos:
- [ ] ⌛️ Inicia desmarcado
- [ ] ⌛️ Pode ser marcado/desmarcado
- [ ] ⌛️ Link dos termos é clicável
- [ ] ⌛️ Impede cadastro se não marcado

#### 🔌 Testes de Integração Backend

| ID | Teste | Serviço/Função | Status | Tempo Resposta | Observações |
|----|-------|----------------|--------|----------------|-------------|
| TI-CAD-001 | Criar usuário no Firebase Auth | `createUserWithEmailAndPassword` | ⌛️ | - | - |
| TI-CAD-002 | Salvar dados iniciais no Firestore | `criarUsuarioInicial` | ⌛️ | - | Verifica se documento é criado em `users/{uid}` |
| TI-CAD-003 | Validar e-mail duplicado | Firebase Auth | ⌛️ | - | Erro `auth/email-already-in-use` |
| TI-CAD-004 | Tratamento de erro de rede | Firebase | ⌛️ | - | Erro `auth/network-request-failed` |

#### 👤 Testes de Usabilidade (UX)

- [ ] ⌛️ Labels dos campos são claras e em português
- [ ] ⌛️ Feedback visual ao preencher campos (validação inline)
- [ ] ⌛️ Mensagens de erro são amigáveis e em português
- [ ] ⌛️ Loading/spinner é exibido durante cadastro
- [ ] ⌛️ Indicação de progresso do cadastro
- [ ] ⌛️ Botões têm tamanho adequado para toque (min 44x44dp)
- [ ] ⌛️ Teclado adequado para cada campo (email keyboard para e-mail)
- [ ] ⌛️ Navegação por Tab funciona corretamente
- [ ] ⌛️ Cores e contraste adequados (acessibilidade)

#### 🧪 Evidência de Sucesso
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE SUCESSO)_

#### 🧪 Evidência de Erro
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE BUG - CASO HAJA)_

#### 🧪 Evidência de Ajuste
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE AJUSTE - CASO HAJA)_

---

### 2️⃣ RECUPERAÇÃO DE SENHA

**NOME DA BRANCH**: `feature/recuperacao-senha`  
**MÓDULO/TELA**: Recuperação de Senha  
**PERFIL**: [Nome]  
**STATUS**: ⌛️ Mapeando

#### 🔄 Fluxo Principal
Usuário acessa "Esqueci minha senha" → insere e-mail → sistema envia link → usuário acessa e-mail → clica no link → define nova senha → login com nova senha.

#### 📋 Regras de Negócio
- **RN1**: O sistema deve validar se o e-mail informado está cadastrado
- **RN2**: O link de redefinição expira em 30 minutos (padrão Firebase)
- **RN3**: Após redefinição, a nova senha deve permitir login imediato
- **RN4**: A nova senha está sendo salva via Firebase Auth
- **RN5**: E-mail de recuperação deve ser enviado em até 2 minutos

#### 🧪 Casos de Teste Detalhados

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-REC-001 | Recuperação com e-mail válido | E-mail cadastrado | 1. Clicar "Esqueci minha senha"<br>2. Inserir e-mail cadastrado<br>3. Confirmar | Sistema envia e-mail e exibe mensagem de confirmação | ⌛️ | - |
| CT-REC-002 | Recuperação com e-mail não cadastrado | E-mail não existe | 1. Inserir e-mail não cadastrado<br>2. Confirmar | Sistema exibe mensagem de erro | ⌛️ | - |
| CT-REC-003 | Recuperação com e-mail inválido | Tela aberta | 1. Inserir e-mail sem @<br>2. Confirmar | Sistema valida formato e exibe erro | ⌛️ | - |
| CT-REC-004 | Clicar no link do e-mail | E-mail recebido | 1. Abrir e-mail<br>2. Clicar no link | Abre tela de redefinição de senha | ⌛️ | - |
| CT-REC-005 | Redefinir senha com sucesso | Link válido aberto | 1. Inserir nova senha<br>2. Confirmar senha<br>3. Salvar | Senha alterada e usuário pode fazer login | ⌛️ | - |
| CT-REC-006 | Link expirado | Link com 30+ minutos | 1. Clicar em link antigo | Sistema exibe erro "Link expirado" | ⌛️ | - |
| CT-REC-007 | Senhas não conferem | Tela de redefinição | 1. Inserir senha diferente na confirmação | Sistema exibe erro "Senhas não conferem" | ⌛️ | - |

#### 🔌 Testes de Integração Backend

| ID | Teste | Serviço/Função | Status | Tempo Resposta | Observações |
|----|-------|----------------|--------|----------------|-------------|
| TI-REC-001 | Enviar e-mail de recuperação | `sendPasswordResetEmail` | ⌛️ | - | Firebase Auth |
| TI-REC-002 | Validar e-mail cadastrado | Firebase Auth | ⌛️ | - | - |
| TI-REC-003 | Redefinir senha | Firebase Auth | ⌛️ | - | Via link do e-mail |

#### 🧪 Evidência de Sucesso
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE SUCESSO)_

#### 🧪 Evidência de Erro
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE BUG - CASO HAJA)_

#### 🧪 Evidência de Ajuste
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE AJUSTE - CASO HAJA)_

---

### 3️⃣ CONFIGURAÇÃO DE PERFIL (Pós-Cadastro)

**NOME DA BRANCH**: `feature/profile-screen`  
**MÓDULO/TELA**: Configuração de Perfil  
**PERFIL**: [Nome]  
**STATUS**: ⌛️ Mapeando

#### 🔄 Fluxo Principal
Após cadastro → usuário escolhe avatar → informa idade → seleciona nível de conhecimento → confirma → sistema salva e redireciona para Home.

#### 📋 Regras de Negócio
- **RN1**: Usuário deve escolher um avatar obrigatoriamente
- **RN2**: Idade deve ser informada (mínimo 6 anos)
- **RN3**: Nível de conhecimento deve ser selecionado
- **RN4**: Dados salvos no Firestore em `users/{uid}`
- **RN5**: Campo `perfilCompleto` deve ser marcado como `true`
- **RN6**: Após conclusão, redirecionar para tela Home/Trilhas

#### 🧪 Casos de Teste Detalhados

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-PERF-001 | Configurar perfil completo | Cadastro concluído | 1. Escolher avatar<br>2. Informar idade<br>3. Selecionar nível<br>4. Confirmar | Perfil salvo e redirecionado para Home | ⌛️ | - |
| CT-PERF-002 | Tentar prosseguir sem avatar | Tela aberta | 1. Não escolher avatar<br>2. Tentar confirmar | Botão desabilitado ou erro exibido | ⌛️ | - |
| CT-PERF-003 | Idade inválida (muito baixa) | Avatar escolhido | 1. Informar idade < 6<br>2. Tentar confirmar | Sistema exibe erro de validação | ⌛️ | - |
| CT-PERF-004 | Idade inválida (muito alta) | Avatar escolhido | 1. Informar idade > 120<br>2. Tentar confirmar | Sistema exibe erro de validação | ⌛️ | - |
| CT-PERF-005 | Sem selecionar nível | Campos preenchidos | 1. Não selecionar nível<br>2. Tentar confirmar | Erro exibido | ⌛️ | - |
| CT-PERF-006 | Salvar sem conexão | Campos preenchidos | 1. Desligar internet<br>2. Tentar salvar | Mensagem de erro de conexão | ⌛️ | - |

#### 🔌 Testes de Integração Backend

| ID | Teste | Serviço/Função | Status | Tempo Resposta | Observações |
|----|-------|----------------|--------|----------------|-------------|
| TI-PERF-001 | Salvar dados no Firestore | `salvarDadosPerfil` | ⌛️ | - | Documento `users/{uid}` |
| TI-PERF-002 | Marcar perfil como completo | `updateDoc` | ⌛️ | - | Campo `perfilCompleto: true` |
| TI-PERF-003 | Buscar dados do perfil | `buscarDadosPerfil` | ⌛️ | - | Verifica integridade dos dados |

#### 🧪 Evidência de Sucesso
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE SUCESSO)_

#### 🧪 Evidência de Erro
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE BUG - CASO HAJA)_

#### 🧪 Evidência de Ajuste
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE AJUSTE - CASO HAJA)_

---

### 4️⃣ MÓDULO DE APRENDIZADO (Trilhas/Histórias/Questões)

**NOME DA BRANCH**: `feature/home-screen`  
**MÓDULO/TELA**: Home → História → Desafios → Questão → Feedback  
**PERFIL**: Júlio  
**STATUS**: ⌛️ Mapeando

#### 🔄 Fluxo Principal
Usuário acessa trilha → visualiza e completa história → acessa desafios → responde questões → recebe feedback → visualiza XP ganho → progresso salvo.

#### 📋 Regras de Negócio
- **RN1**: Usuário deve estar logado para acessar trilhas
- **RN2**: Primeira trilha (Trilha 1) deve estar desbloqueada por padrão
- **RN3**: Trilhas subsequentes só desbloqueiam após conclusão completa da anterior (história + todas as questões)
- **RN4**: História deve ser concluída antes de acessar questões
- **RN5**: Cada questão deve exibir feedback imediato (acerto/erro)
- **RN6**: Sistema deve salvar progresso após cada ação (história concluída, questão respondida)
- **RN7**: Progresso da trilha = 50% história + 50% questões
- **RN8**: XP é ganho apenas na primeira tentativa de cada questão
- **RN9**: Dados salvos em AsyncStorage local

#### 🧪 Casos de Teste Detalhados - HOME

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-HOME-001 | Visualizar trilhas disponíveis | Usuário logado | 1. Acessar Home | Lista de trilhas exibida com status correto | ⌛️ | - |
| CT-HOME-002 | Trilha 1 desbloqueada por padrão | Primeiro acesso | 1. Acessar Home | Trilha 1 está disponível (não bloqueada) | ⌛️ | - |
| CT-HOME-003 | Trilhas 2+ bloqueadas inicialmente | Primeiro acesso | 1. Acessar Home | Trilhas 2+ exibem ícone de cadeado | ⌛️ | - |
| CT-HOME-004 | Clicar em trilha desbloqueada | Trilha disponível | 1. Clicar na Trilha 1 | Navega para tela de História | ⌛️ | - |
| CT-HOME-005 | Clicar em trilha bloqueada | Trilha bloqueada | 1. Clicar em trilha com cadeado | Alerta informando que precisa concluir anterior | ⌛️ | - |
| CT-HOME-006 | Visualizar progresso | Trilha em andamento | 1. Acessar Home | Barra de progresso exibe % correto | ⌛️ | - |
| CT-HOME-007 | Visualizar XP total | Usuário com XP | 1. Acessar Home | XP total é exibido corretamente | ⌛️ | - |
| CT-HOME-008 | Atualizar progresso ao retornar | Questão respondida em outra tela | 1. Responder questão<br>2. Voltar para Home | Progresso atualizado automaticamente | ⌛️ | - |

#### 🧪 Casos de Teste Detalhados - HISTÓRIA

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-HIST-001 | Visualizar história da trilha | Trilha acessada | 1. Clicar em trilha<br>2. Acessar história | Conteúdo da história exibido | ⌛️ | - |
| CT-HIST-002 | Concluir história | História aberta | 1. Rolar até o fim<br>2. Clicar "Concluir" | História marcada como concluída | ⌛️ | - |
| CT-HIST-003 | Verificar progresso após história | História concluída | 1. Concluir história<br>2. Voltar para Home | Progresso da trilha = 50% | ⌛️ | - |
| CT-HIST-004 | Desbloquear questões após história | História concluída | 1. Concluir história<br>2. Acessar Desafios | Questões estão disponíveis | ⌛️ | - |
| CT-HIST-005 | Tentar acessar questões sem história | História não concluída | 1. Acessar Desafios sem concluir história | Mensagem de bloqueio exibida | ⌛️ | - |

#### 🧪 Casos de Teste Detalhados - DESAFIOS

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-DESA-001 | Visualizar lista de questões | História concluída | 1. Acessar Desafios | Lista de questões exibida | ⌛️ | - |
| CT-DESA-002 | Status de questões não respondidas | Nenhuma questão respondida | 1. Visualizar lista | Questões exibem status "Não iniciada" | ⌛️ | - |
| CT-DESA-003 | Status de questão correta | Questão respondida corretamente | 1. Visualizar lista | Questão exibe ícone de sucesso ✅ | ⌛️ | - |
| CT-DESA-004 | Status de questão incorreta | Questão respondida incorretamente | 1. Visualizar lista | Questão exibe ícone de erro ❌ | ⌛️ | - |
| CT-DESA-005 | Clicar em questão | Lista exibida | 1. Clicar em uma questão | Navega para tela de Questão | ⌛️ | - |

#### 🧪 Casos de Teste Detalhados - QUESTÃO

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-QUES-001 | Visualizar questão | Questão acessada | 1. Abrir questão | Pergunta e opções exibidas | ⌛️ | - |
| CT-QUES-002 | Selecionar opção | Questão aberta | 1. Clicar em uma opção | Opção é marcada visualmente | ⌛️ | - |
| CT-QUES-003 | Responder sem selecionar | Nenhuma opção selecionada | 1. Clicar "Responder" | Botão desabilitado ou alerta exibido | ⌛️ | - |
| CT-QUES-004 | Responder corretamente | Opção correta selecionada | 1. Selecionar opção correta<br>2. Clicar "Responder" | Navega para Feedback positivo | ⌛️ | - |
| CT-QUES-005 | Responder incorretamente | Opção incorreta selecionada | 1. Selecionar opção incorreta<br>2. Clicar "Responder" | Navega para Feedback negativo | ⌛️ | - |
| CT-QUES-006 | Salvar resposta | Questão respondida | 1. Responder questão | Resposta salva no AsyncStorage | ⌛️ | - |

#### 🧪 Casos de Teste Detalhados - FEEDBACK

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------|-------------|
| CT-FEED-001 | Feedback de acerto | Resposta correta | 1. Visualizar feedback | Mensagem positiva + confete + XP exibidos | ⌛️ | - |
| CT-FEED-002 | Feedback de erro | Resposta incorreta | 1. Visualizar feedback | Mensagem motivacional + explicação exibidas | ⌛️ | - |
| CT-FEED-003 | XP ganho na primeira tentativa | Primeira resposta correta | 1. Visualizar feedback | XP é adicionado e exibido | ⌛️ | - |
| CT-FEED-004 | Sem XP em tentativas seguintes | Questão já respondida | 1. Responder novamente | XP não é adicionado | ⌛️ | - |
| CT-FEED-005 | Continuar após feedback | Feedback exibido | 1. Clicar "Continuar" | Volta para lista de Desafios | ⌛️ | - |
| CT-FEED-006 | Explicação da resposta | Feedback exibido | 1. Visualizar feedback | Explicação correta da questão é mostrada | ⌛️ | - |

#### 🧪 Casos de Teste - LÓGICA DE DESBLOQUEIO

| ID | Descrição | Pré-condição | Passos | Resultado Esperado | Status | Observações |
|----|-----------|--------------|--------|-------------------|--------|-------------|
| CT-DESB-001 | Desbloquear próxima trilha | Trilha completada 100% | 1. Concluir história<br>2. Responder todas as questões<br>3. Voltar para Home | Próxima trilha é desbloqueada | ⌛️ | - |
| CT-DESB-002 | Não desbloquear com história apenas | Apenas história concluída | 1. Concluir história<br>2. Não responder questões<br>3. Verificar próxima trilha | Próxima trilha continua bloqueada | ⌛️ | - |
| CT-DESB-003 | Não desbloquear com questões apenas | Apenas questões respondidas | 1. Responder questões sem história<br>2. Verificar próxima trilha | Próxima trilha continua bloqueada | ⌛️ | - |
| CT-DESB-004 | Progresso correto (50% história) | História concluída | 1. Concluir história | Progresso = 50% | ⌛️ | - |
| CT-DESB-005 | Progresso correto (100%) | Tudo concluído | 1. Concluir história e questões | Progresso = 100% | ⌛️ | - |

#### 🔌 Testes de Integração/Persistência

| ID | Teste | Serviço/Função | Status | Observações |
|----|-------|----------------|--------|-------------|
| TI-APRE-001 | Salvar história concluída | `markHistoriaAsCompleted` | ⌛️ | AsyncStorage |
| TI-APRE-002 | Salvar questão respondida | `markQuestaoAsCompleted` | ⌛️ | AsyncStorage |
| TI-APRE-003 | Calcular progresso da trilha | `calculateTrilhaProgress` | ⌛️ | Fórmula: 50% história + 50% questões |
| TI-APRE-004 | Verificar desbloqueio | `isTrilhaUnlocked` | ⌛️ | Valida trilha anterior 100% |
| TI-APRE-005 | Buscar progresso salvo | `loadProgress` | ⌛️ | AsyncStorage |
| TI-APRE-006 | Reset de progresso (debug) | `resetProgress` | ⌛️ | Limpa AsyncStorage |

#### ⚡ Testes de Performance

| Métrica | Valor Esperado | Valor Obtido | Status |
|---------|----------------|--------------|--------|
| Tempo de carregamento da Home | < 1s | - | ⌛️ |
| Tempo para navegar entre telas | < 500ms | - | ⌛️ |
| Tempo de leitura AsyncStorage | < 100ms | - | ⌛️ |
| Tempo de escrita AsyncStorage | < 200ms | - | ⌛️ |
| Uso de memória (Home) | < 100MB | - | ⌛️ |
| FPS durante animações | 60 FPS | - | ⌛️ |

#### 👤 Testes de Usabilidade (UX)

- [ ] ⌛️ Trilhas bloqueadas têm indicação visual clara (cadeado)
- [ ] ⌛️ Progresso é visível em cada trilha
- [ ] ⌛️ Animações são suaves e não travadas
- [ ] ⌛️ Feedback de loading durante salvamento
- [ ] ⌛️ Confete aparece em respostas corretas
- [ ] ⌛️ Cores e ícones indicam status claramente
- [ ] ⌛️ Navegação intuitiva entre telas
- [ ] ⌛️ Mensagens motivacionais em erros
- [ ] ⌛️ XP é destacado visualmente

#### 🧪 Evidência de Sucesso
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE SUCESSO)_

#### 🧪 Evidência de Erro
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE BUG - CASO HAJA)_

#### 🧪 Evidência de Ajuste
_(ANEXE AQUI IMAGENS/SCREENSHOTS DE AJUSTE - CASO HAJA)_

---

## 🐛 REGISTRO DE BUGS

### Template de Bug

| ID | Severidade | Módulo | Descrição | Passos para Reproduzir | Status | Responsável | Data |
|----|------------|--------|-----------|------------------------|--------|-------------|------|
| BUG-001 | 🐞 Crítico | - | - | - | Aberto | - | - |

### Classificação de Severidade

| Ícone | Severidade | Descrição | SLA Correção |
|-------|------------|-----------|--------------|
| 🐞 | Crítica | App trava, perda de dados, funcionalidade principal não funciona | Imediato |
| ❌ | Alta | Funcionalidade importante com falha, mas há workaround | 1-2 dias |
| ⚠️ | Média | Funcionalidade secundária com problema, impacto limitado | 3-5 dias |
| ℹ️ | Baixa | Problema estético, mensagem incorreta, melhoria de UX | 1-2 semanas |

---

## ⛔ TESTES NEGATIVOS (Cenários de Erro)

### Cadastro
- [ ] ⌛️ App não trava ao perder conexão durante cadastro
- [ ] ⌛️ Não permite SQL injection em campos de texto
- [ ] ⌛️ Não permite scripts maliciosos (XSS)
- [ ] ⌛️ Limita tamanho máximo dos campos
- [ ] ⌛️ Botão desabilita após primeiro clique (evita duplicação)
- [ ] ⌛️ Valida caracteres especiais adequadamente

### Navegação
- [ ] ⌛️ Não permite acesso a telas sem autenticação
- [ ] ⌛️ Não quebra ao pressionar "voltar" rapidamente
- [ ] ⌛️ Mantém estado ao minimizar app
- [ ] ⌛️ Trata corretamente falta de dados

### Persistência
- [ ] ⌛️ Não perde dados ao fechar app abruptamente
- [ ] ⌛️ Trata erro de leitura/escrita no AsyncStorage
- [ ] ⌛️ Sincroniza corretamente após reconexão

---

## ✅ CRITÉRIOS DE ACEITAÇÃO

### Para Módulo ser Aprovado:

#### Obrigatório (Bloqueante):
- [ ] ✅ Todos os casos de teste prioritários (P0) passaram
- [ ] ✅ Nenhum bug crítico (🐞) pendente
- [ ] ✅ Nenhum bug de severidade alta (❌) pendente
- [ ] ✅ Regras de negócio implementadas e validadas
- [ ] ✅ Dados salvos corretamente (Firebase/AsyncStorage)
- [ ] ✅ Funciona em pelo menos 2 dispositivos diferentes (Android/iOS)

#### Desejável (Não Bloqueante):
- [ ] ⚠️ Máximo 2 bugs médios (⚠️) aceitáveis
- [ ] ⚠️ Performance dentro dos limites esperados
- [ ] ⚠️ Testes de usabilidade aprovados
- [ ] ⚠️ Sem erros de console/warnings excessivos
- [ ] ⚠️ Código revisado por pelo menos 1 pessoa
- [ ] ⚠️ Aprovação do Product Owner/Professor

---

## 💡 OBSERVAÇÕES E MELHORIAS

### Pontos Positivos
- Layout responsivo e agradável
- Animações suaves
- Fluxo intuitivo
- Gamificação engajadora

### Pontos de Melhoria
- [ ] Adicionar opção "Cadastrar com Google"
- [ ] Melhorar feedback de loading
- [ ] Adicionar validação de senha forte
- [ ] Implementar modo offline básico
- [ ] Adicionar indicadores de acessibilidade

### Melhorias Futuras (Backlog)
- [ ] Cadastro biométrico
- [ ] Autenticação de dois fatores
- [ ] Verificação de e-mail obrigatória
- [ ] Sistema de ranking/leaderboard
- [ ] Notificações push
- [ ] Modo escuro

---

## 📊 MÉTRICAS DE QUALIDADE

### Cobertura de Testes

| Módulo | Casos Planejados | Casos Executados | Casos Aprovados | % Cobertura |
|--------|------------------|------------------|-----------------|-------------|
| Cadastro | - | - | - | - |
| Recuperação Senha | - | - | - | - |
| Configuração Perfil | - | - | - | - |
| Aprendizado | - | - | - | - |
| **TOTAL** | **0** | **0** | **0** | **0%** |

### Taxa de Sucesso

```
Taxa de Aprovação = (Casos Aprovados / Casos Executados) × 100%
Taxa Atual: 0%
Meta: > 95%
```

### Bugs por Severidade

| Severidade | Abertos | Em Correção | Fechados | Total |
|------------|---------|-------------|----------|-------|
| 🐞 Crítica | 0 | 0 | 0 | 0 |
| ❌ Alta | 0 | 0 | 0 | 0 |
| ⚠️ Média | 0 | 0 | 0 | 0 |
| ℹ️ Baixa | 0 | 0 | 0 | 0 |
| **TOTAL** | **0** | **0** | **0** | **0** |

---

## 📝 APROVAÇÕES

| Papel | Nome | Assinatura | Data |
|-------|------|------------|------|
| Testador | - | - | - |
| Desenvolvedor | - | - | - |
| Product Owner | - | - | - |
| Professor | - | - | - |

---

## 🔗 ANEXOS

- Link do Repositório: [GitHub - FinGo](https://github.com/seu-repo/fingo-app)
- Link do Backlog: `docs/Backlog do Produto - Aplicativo FinGo.md`
- Link do Protótipo: [Figma - FinGo]
- Vídeos de Teste: [Pasta Drive/Vídeos]

---

**Documento criado por**: Thamy  
**Última atualização**: 13/10/2025  
**Versão**: 1.0  
**Status**: 📋 Em andamento

