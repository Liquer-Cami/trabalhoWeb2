import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { concluirTarefa, excluirTarefa, tarefaOcorreNaData, type Tarefa } from "@/services/tarefas";
import EditarTarefa from "./editarTarefa";

interface CardTarefaProps {
    dataSelecionada: Date;
    tarefas: Tarefa[];
    onAlterada: () => void;
}

function formatarData(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

export default function CardTarefa({ dataSelecionada, tarefas, onAlterada }: CardTarefaProps) {
    const [erro, setErro] = useState("");
    const dataAtual = formatarData(dataSelecionada);
    const tarefaDoDia = tarefas
        .filter((tarefa) => tarefaOcorreNaData(tarefa, dataAtual))
        .map((tarefa) => ({
            ...tarefa,
            data_ocorrencia: dataAtual,
            status: tarefa.recorrencia
                ? (tarefa.ocorrencias_concluidas ?? []).includes(dataAtual)
                    || (tarefa.data === dataAtual && tarefa.status === "Concluída")
                    ? "Concluída" as const
                    : "Pendente" as const
                : tarefa.status,
        }));

    async function alternarConclusao(tarefa: Tarefa) {
        setErro("");
        try {
            const { ok, dados } = await concluirTarefa(
                tarefa.id,
                tarefa.status !== "Concluída",
                tarefa.data_ocorrencia,
            );
            if (!ok) {
                setErro(dados?.message ?? "Não foi possível atualizar a tarefa.");
                return;
            }
            onAlterada();
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        }
    }

    async function removerTarefa(id: string) {
        setErro("");
        try {
            const { ok, dados } = await excluirTarefa(id);
            if (!ok) {
                setErro(dados?.message ?? "Não foi possível excluir a tarefa.");
                return;
            }
            onAlterada();
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        }
    }

    if (tarefaDoDia.length === 0) {
        return (
            <div>
                {erro && <p role="alert" className="mb-3 text-red-700">{erro}</p>}
                <h2 className="text-xl font-bold">Nenhuma tarefa para esse dia!</h2>
            </div>
        );
    }

    return (
        <div>
            {erro && <p role="alert" className="mb-3 text-red-700">{erro}</p>}
            <ul className="flex flex-col w-full gap-5">
                {tarefaDoDia.map((tarefa) => (
                    <li key={tarefa.id} className="w-full max-w-5xl">
                        <article
                            className={`flex items-center justify-around rounded-2xl bg-[var(--creme-claro)] px-10 py-4 shadow-[0_0px_8px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${
                                tarefa.prioridade === "Alta"
                                    ? "border-l-8 border-red-500"
                                    : tarefa.prioridade === "Média"
                                        ? "border-l-8 border-yellow-500"
                                        : "border-l-8 border-green-500"
                            }`}
                        >
                            <div className="grid w-full gap-5">
                                <div className="flex justify-between">
                                    <span className={`text-lg font-bold ${tarefa.status === "Concluída" ? "line-through opacity-60" : ""}`}>
                                        {tarefa.titulo}
                                    </span>
                                    <div className="flex gap-5 items-center">
                                        <input
                                            type="checkbox"
                                            id={`tarefa-concluida-${tarefa.id}`}
                                            checked={tarefa.status === "Concluída"}
                                            onChange={() => void alternarConclusao(tarefa)}
                                            aria-label={`Marcar ${tarefa.titulo} como concluída`}
                                            className="h-6 w-6 accent-[#3F5B4B]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => void removerTarefa(tarefa.id)}
                                            aria-label={`Excluir ${tarefa.titulo}`}
                                            className="hover:text-red-500 hover:scale-110 transition"
                                        >
                                            <TrashIcon className="h-6 w-6" />
                                        </button>
                                        <EditarTarefa tarefa={tarefa} onSalva={onAlterada} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <span>
                                            Dificuldade:{" "}
                                            {tarefa.dificuldade === "Difícil"
                                                ? "⚡⚡⚡"
                                                : tarefa.dificuldade === "Médio"
                                                    ? "⚡⚡"
                                                    : "⚡"}
                                        </span>
                                        <span>Tempo estimado: {tarefa.tempo_estimado || "—"}</span>
                                    </div>
                                </div>
                                {tarefa.observacao && <p>{tarefa.observacao}</p>}
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </div>
    );
}
