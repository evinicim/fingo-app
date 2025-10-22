// ... existing code ...

/**
 * Buscar dados de FAQ do Firebase
 */
export async function getFAQData() {
  try {
    const snap = await getDocs(collection(db, 'faq'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar FAQ:', error);
    // Fallback para dados estáticos
    return [
      {
        id: 'faq_1',
        question: "Como eu posso trocar a minha senha?",
        answer: "Você pode trocar a sua senha na página de configurações do perfil. A opção para redefinir a senha estará disponível no menu."
      },
      {
        id: 'faq_2', 
        question: "O que é educação financeira gamificada?",
        answer: "É uma metodologia que usa elementos de jogos para ensinar conceitos financeiros de forma divertida e interativa, ajudando você a aprender sobre dinheiro de um jeito novo."
      },
      {
        id: 'faq_3',
        question: "Posso usar o aplicativo offline?",
        answer: "O aplicativo precisa de conexão com a internet para carregar os conteúdos e sincronizar seu progresso. No entanto, algumas atividades podem ser acessadas offline."
      }
    ];
  }
}

/**
 * Buscar avatares disponíveis do Firebase
 */
export async function getAvatares() {
  try {
    const snap = await getDocs(collection(db, 'avatares'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar avatares:', error);
    // Fallback para dados estáticos
    return [
      { id: '1', icon: '👦', name: 'João' },
      { id: '2', icon: '👧', name: 'Maria' },
      { id: '3', icon: '🧑', name: 'Alex' },
      { id: '4', icon: '👩', name: 'Ana' },
      { id: '5', icon: '👨', name: 'Carlos' },
      { id: '6', icon: '👩‍🦱', name: 'Sofia' }
    ];
  }
}

/**
 * Buscar níveis de conhecimento do Firebase
 */
export async function getNiveisConhecimento() {
  try {
    const snap = await getDocs(collection(db, 'niveisConhecimento'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar níveis:', error);
    // Fallback para dados estáticos
    return [
      { id: 'iniciante', label: 'Iniciante', description: 'Estou começando a aprender sobre finanças', icon: '🌱' },
      { id: 'intermediario', label: 'Intermediário', description: 'Já tenho algumas noções básicas', icon: '📈' },
      { id: 'avancado', label: 'Avançado', description: 'Tenho conhecimento sólido em finanças', icon: '💎' }
    ];
  }
}