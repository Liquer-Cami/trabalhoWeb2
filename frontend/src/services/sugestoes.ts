import { chamarApi } from '@/services/api';

// Uma tarefa JÁ CADASTRADA que a IA (Gemini) recomendou
export interface Recomendacao {
  id: string;
  titulo: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tempo_estimado: string;
  data: string;
  motivo: string; 
}

// Pede ao backend as tarefas de hoje recomendadas para o check-in de hoje.
export const gerarRecomendacoes = () => chamarApi<Recomendacao[]>('POST', '/sugestoes.php');
