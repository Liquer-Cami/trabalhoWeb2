import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import ButtonSelect from "@/components/ui/buttonSelect";
import { useState } from "react";
import { criarTarefa, type NovaTarefa } from "@/services/tarefas";

interface FormTarefaProps {
  onCriada?: () => void;
}

const prioridades = ["Alta", "Média", "Baixa"] as const;
const dificuldades = ["Fácil", "Médio", "Difícil"] as const;
const recorrencias = ["Sem recorrência", "Diária", "Semanal", "Mensal"] as const;

export default function FormTarefa({ onCriada }: FormTarefaProps) {
  const [modalAberta, setModalAberta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [titulo, setTitulo] = useState("");
  const [tempo_estimado, setTempoEstimado] = useState("");
  const [prioridade, setPrioridade] = useState<NovaTarefa["prioridade"]>("Baixa");
  const [dificuldade, setDificuldade] = useState<NovaTarefa["dificuldade"]>("Fácil");
  const [recorrencia, setRecorrencia] = useState<NovaTarefa["recorrencia"]>("");
  const [observacao, setObservacao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  function resetForm() {
    setTitulo(""); setTempoEstimado(""); setPrioridade("Baixa");
    setDificuldade("Fácil"); setRecorrencia(""); setObservacao("");
    setData(new Date().toISOString().split("T")[0]); setErro("");
  }

  async function handleSubmit() {
    if (!titulo.trim()) { setErro("O título é obrigatório."); return; }
    setLoading(true);
    try {
      const { ok, dados } = await criarTarefa({
        titulo: titulo.trim(),
        tempo_estimado,
        prioridade,
        dificuldade,
        recorrencia,
        observacao,
        data,
      });
      if (ok && dados?.status === "success") {
        resetForm();
        setModalAberta(false);
        onCriada?.();
      } else {
        setErro(dados?.message || "Erro ao criar tarefa.");
      }
    } catch {
      setErro("Não foi possível conectar ao servidor. Verifique o Apache do XAMPP.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button texto="Adicionar Tarefa +" tamanho="px-12 py-4.5" onClick={() => setModalAberta(true)} />

      {modalAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col gap-10 p-5 bg-[var(--background)] rounded-2xl w-[500px] h-[580px] overflow-y-auto">

            <div className="flex gap-3 items-center">
              <h1 className="text-2xl font-bold">Título:</h1>
              <Input type="text" id="titulo-tarefa" tamanho="px-10 py-2" placeholder="título da tarefa" value={titulo} onChange={setTitulo} />
            </div>

            <div className="flex flex-col gap-5 font-bold">
              <div className="flex gap-5 items-center">
                <p>Prioridade:</p>
                {prioridades.map((p) => (
                  <ButtonSelect key={p} texto={p} tamanho="px-4 py-2 text-md"
                    cor={`${p === "Alta" ? "text-red-500 border-red-500 hover:bg-red-200 focus:bg-red-200" : p === "Média" ? "text-yellow-500 border-yellow-500 hover:bg-yellow-200 focus:bg-yellow-200" : "text-green-500 border-green-500 hover:bg-green-200 focus:bg-green-200"} bg-[var(--creme-claro)] ${prioridade === p ? "opacity-100 ring-2" : "opacity-60"}`}
                    onClick={() => setPrioridade(p)} />
                ))}
              </div>

              <div className="flex gap-5 items-center">
                <p>Dificuldade:</p>
                {dificuldades.map((valor) => (
                  <label key={valor} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="dificuldade-tarefa"
                      checked={dificuldade === valor}
                      onChange={() => setDificuldade(valor)}
                      className="h-5 w-5 accent-[var(--verde)]"
                    />
                    {valor}
                  </label>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <p>Tempo estimado:</p>
                <Input type="text" id="tempo-tarefa" tamanho="px-2 py-2" placeholder="HH:mm" value={tempo_estimado} onChange={setTempoEstimado} />
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <p>Recorrência:</p>
                {recorrencias.map((r) => (
                  <ButtonSelect key={r} texto={r} tamanho="px-4 py-2 text-md"
                    cor={`bg-[var(--creme-claro)] text-[var(--verde)] border-[var(--verde)] hover:bg-[#DFEBE4] focus:bg-[#DFEBE4] ${recorrencia === r ? "ring-2" : "opacity-60"}`}
                    onClick={() => setRecorrencia(r === "Sem recorrência" ? "" : r)} />
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <p>Data:</p>
                <Input type="date" id="data-tarefa" tamanho="px-2 py-2" value={data} onChange={setData} />
              </div>

              <div className="flex gap-2 items-center">
                <p>Observação:</p>
                <Input type="text" id="observacao-tarefa" tamanho="px-10 py-2" placeholder="detalhes da tarefa" value={observacao} onChange={setObservacao} />
              </div>
            </div>

            {erro && <p className="text-red-500 text-sm">{erro}</p>}

            <div className="flex justify-end gap-5">
              <Button texto="Sair" tamanho="px-8 py-4" onClick={() => { resetForm(); setModalAberta(false); }} />
              <Button texto={loading ? "Salvando..." : "Adicionar +"} tamanho="px-8 py-4" onClick={handleSubmit} disabled={loading} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
