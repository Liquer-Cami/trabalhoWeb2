import Button from "@/components/ui/button";
import ButtonSelect from "@/components/ui/buttonSelect";
import Input from "@/components/ui/input";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { editarTarefa, type Tarefa } from "@/services/tarefas";

interface EditarTarefaProps {
    tarefa: Tarefa;
    onSalva: () => void;
}

export default function EditarTarefa({ tarefa, onSalva }: EditarTarefaProps) {
    const [detalhes, setDetalhes] = useState(false);
    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [prioridade, setPrioridade] = useState(tarefa.prioridade);
    const [dificuldade, setDificuldade] = useState(tarefa.dificuldade);
    const [tempoEstimado, setTempoEstimado] = useState(tarefa.tempo_estimado);
    const [recorrencia, setRecorrencia] = useState(tarefa.recorrencia);
    const [observacao, setObservacao] = useState(tarefa.observacao);
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function salvar() {
        if (!titulo.trim()) {
            setErro("O título é obrigatório.");
            return;
        }

        setSalvando(true);
        setErro("");
        try {
            const { ok, dados } = await editarTarefa({
                ...tarefa,
                titulo: titulo.trim(),
                prioridade,
                dificuldade,
                tempo_estimado: tempoEstimado,
                recorrencia,
                observacao,
            });
            if (!ok) {
                setErro(dados?.message ?? "Não foi possível salvar as alterações.");
                return;
            }
            setDetalhes(false);
            onSalva();
        } catch {
            setErro("Não foi possível conectar ao servidor.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div>
            <EllipsisVerticalIcon className="h-7 w-7 hover:scale-110 transition" onClick={() => setDetalhes(!detalhes)} />
            {detalhes && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="flex flex-col gap-10 p-5 bg-[var(--background)] rounded-2xl w-[500px] h-[580px] overflow-y-auto">
                        <div className="flex gap-3 items-center">
                            <h1 className="text-2xl font-bold">Título:</h1>
                            <Input type="text" id={`titulo-tarefa-${tarefa.id}`} tamanho="px-10 py-2" placeholder="titulo da tarefa" value={titulo} onChange={setTitulo} />
                        </div>
                        <div className="flex flex-col gap-5 font-bold">
                            <div className="flex gap-5">
                                <p>Prioridade:</p>
                                <ButtonSelect texto="Alta" tamanho="px-4 py-2 text-md" cor="bg-[var(--creme-claro)] text-red-500 border-red-500 hover:bg-red-200 focus:bg-red-200" onClick={() => setPrioridade("Alta")} />
                                <ButtonSelect texto="Média" tamanho="px-4 py-2 text-md" cor="bg-[var(--creme-claro)] text-yellow-500 border-yellow-500 hover:bg-yellow-200 focus:bg-yellow-200" onClick={() => setPrioridade("Média")} />
                                <ButtonSelect texto="Baixa" tamanho="px-4 py-2 text-md" cor="bg-[var(--creme-claro)] text-green-500 border-green-500 hover:bg-green-200 focus:bg-green-200" onClick={() => setPrioridade("Baixa")} />
                            </div>
                            <div className="flex gap-5">
                                <p>Dificuldade:</p>
                                {(["Fácil", "Médio", "Difícil"] as const).map((valor) => (
                                    <label key={valor} className="flex items-center gap-1">
                                        <input type="radio" name={`dificuldade-${tarefa.id}`} checked={dificuldade === valor} onChange={() => setDificuldade(valor)} className="h-5 w-5 accent-[var(--verde)]" />
                                        {valor}
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-2 items-center">
                                <p>Tempo estimado:</p>
                                <Input type="text" id={`tempo-tarefa-${tarefa.id}`} tamanho="px-2 py-2" placeholder="HH:mm" value={tempoEstimado} onChange={setTempoEstimado} />
                            </div>
                            <div className="flex gap-2 items-center">
                                <p>Status: {tarefa.status}</p>
                            </div>
                            <div className="flex gap-5 items-center flex-wrap">
                                <p>Recorrência:</p>
                                {(["Sem recorrência", "Diária", "Semanal", "Mensal"] as const).map((valor) => (
                                    <ButtonSelect key={valor} texto={valor} tamanho="px-4 py-2 text-md" cor="bg-[var(--creme-claro)] text-[var(--verde)] border-[var(--verde)] hover:bg-[#DFEBE4] focus:bg-[#DFEBE4]" onClick={() => setRecorrencia(valor === "Sem recorrência" ? "" : valor)} />
                                ))}
                            </div>
                            <div className="flex gap-2 items-center">
                                <p>Observação:</p>
                                <Input type="text" id={`observacao-tarefa-${tarefa.id}`} tamanho="px-10 py-2" placeholder="detalhes da tarefa" value={observacao} onChange={setObservacao} />
                            </div>
                        </div>
                        {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}
                        <div className="flex justify-end gap-5">
                            <Button texto={salvando ? "Salvando..." : "Salvar Alterações"} tamanho="px-8 py-4" onClick={() => void salvar()} disabled={salvando} />
                            <Button texto="Sair" tamanho="px-8 py-4" onClick={() => setDetalhes(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
