import { tarefaOcorreNaData, type Tarefa } from "@/services/tarefas";
import type { Checkin } from "@/services/checkin";

interface CalendarioHistoricoProps {
    dataSelecionada: Date;
    setDataSelecionada: (data: Date) => void;
    tarefas: Tarefa[];
    checkins: Checkin[];
}

function formatarData(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

export default function CalendarioHistorico({
    dataSelecionada,
    setDataSelecionada,
    tarefas,
    checkins,
}: CalendarioHistoricoProps) {
    const mes = dataSelecionada.getMonth();
    const ano = dataSelecionada.getFullYear();
    const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long" })
        .format(new Date(ano, mes, 1));
    const dias = Array.from({ length: quantidadeDias }, (_, index) => index + 1);

    return (
        <div className="rounded-2xl bg-[var(--creme-claro)] shadow-[0_0px_8px_rgba(0,0,0,0.06)] w-full p-2 text-lg">
            <div className="mb-4 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => setDataSelecionada(new Date(ano, mes - 1, 1))}
                    className="rounded-full px-2 py-1 text-xl text-[var(--verde)] hover:bg-[#DFEBE4]"
                    aria-label="Mês anterior"
                >
                    ‹
                </button>
                <h2 className="font-semibold capitalize text-[var(--verde)]">
                    {nomeMes} {ano}
                </h2>
                <button
                    type="button"
                    onClick={() => setDataSelecionada(new Date(ano, mes + 1, 1))}
                    className="rounded-full px-2 py-1 text-xl text-[var(--verde)] hover:bg-[#DFEBE4]"
                    aria-label="Próximo mês"
                >
                    ›
                </button>
            </div>

            <div className="flex flex-col gap-3">
                <div className="mb-2 grid grid-cols-7 text-center text-sm font-semibold text-gray-500">
                    <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-x-1 gap-y-4">
                    {Array.from({ length: primeiroDia }).map((_, index) => (
                        <div key={`vazio-${index}`} />
                    ))}
                    {dias.map((dia) => {
                        const dataDia = formatarData(new Date(ano, mes, dia));
                        const selecionado = dataSelecionada.getDate() === dia
                            && dataSelecionada.getMonth() === mes
                            && dataSelecionada.getFullYear() === ano;
                        const registroTarefa = tarefas.some((tarefa) => tarefaOcorreNaData(tarefa, dataDia));
                        const registroEmocional = checkins.some((checkin) => checkin.data.slice(0, 10) === dataDia);

                        return (
                            <button
                                key={dia}
                                type="button"
                                onClick={() => setDataSelecionada(new Date(ano, mes, dia))}
                                aria-label={`${dia} de ${nomeMes}${registroTarefa ? ", tarefas" : ""}${registroEmocional ? ", check-in emocional" : ""}`}
                                className={`h-20 w-full rounded-xl text-md transition flex flex-col border-2 border-[var(--verde)] items-center ${
                                    selecionado
                                        ? "bg-[var(--verde)] text-white"
                                        : "text-[var(--verde)] hover:bg-[#DFEBE4]"
                                }`}
                            >
                                {dia}
                                <div className="mt-auto mb-2 flex gap-1">
                                    {registroEmocional && <span className="h-3 w-3 rounded-full bg-blue-500" />}
                                    {registroTarefa && <span className="h-3 w-3 rounded-full bg-green-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
