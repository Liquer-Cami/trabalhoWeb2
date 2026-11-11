import { chamarApi } from '@/services/api';

export interface Tarefa {
  id: string;
  usuario_id?: number | string;
  titulo: string;
  tempo_estimado: string;
  tempo_realizado: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  recorrencia: 'Diária' | 'Semanal' | 'Mensal' | '';
  ocorrencias_concluidas?: string[];
  status: 'Pendente' | 'Concluída';
  observacao: string;
  data: string;
  data_ocorrencia?: string;
}

export type NovaTarefa = Omit<Tarefa, 'id' | 'usuario_id' | 'tempo_realizado' | 'status'>;

export function tarefaOcorreNaData(tarefa: Tarefa, data: string): boolean {
  if (!tarefa.recorrencia) return tarefa.data === data;

  const [anoInicio, mesInicio, diaInicio] = tarefa.data.split('-').map(Number);
  const [anoAtual, mesAtual, diaAtual] = data.split('-').map(Number);
  const inicio = Date.UTC(anoInicio, mesInicio - 1, diaInicio);
  const atual = Date.UTC(anoAtual, mesAtual - 1, diaAtual);
  const diasDesdeInicio = Math.floor((atual - inicio) / 86400000);
  if (diasDesdeInicio < 0 || diasDesdeInicio >= 30) return false;

  switch (tarefa.recorrencia) {
    case 'Diária':
      return true;
    case 'Semanal':
      return diasDesdeInicio % 7 === 0;
    case 'Mensal':
      return diaInicio === diaAtual
        && mesAtual + (anoAtual - anoInicio) * 12 - mesInicio >= 0;
    default:
      return false;
  }
}

export const listarTarefas = () => chamarApi<Tarefa[]>('GET', '/tarefas.php');
export const criarTarefa = (t: NovaTarefa) => chamarApi<Tarefa>('POST', '/tarefas.php', t);
export const editarTarefa = (t: Tarefa) => chamarApi<Tarefa>('PUT', '/tarefas.php', t);
export const excluirTarefa = (id: string) => chamarApi('DELETE', '/tarefas.php', { id });
export const concluirTarefa = (id: string, concluida: boolean, dataOcorrencia?: string) =>
  chamarApi<Tarefa>('PATCH', '/tarefas.php', {
    id,
    concluida,
    ...(dataOcorrencia ? { data_ocorrencia: dataOcorrencia } : {}),
  });
