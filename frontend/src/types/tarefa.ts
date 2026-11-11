export interface TarefaProps {
    id: number;
    titulo: string;
    tempo_estimado: string;
    tempo_realizado: string;
    prioridade: 'Baixa' | 'Média' | 'Alta';
    dificuldade: 'Fácil' | 'Médio' | 'Difícil';
    recorrencia: 'Diária' | 'Semanal' | 'Quinzenal' | 'Mensal';
    status: 'Concluída' | 'Pendente';
    observacao: string;
    data: string;
}