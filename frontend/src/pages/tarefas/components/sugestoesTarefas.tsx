import { useState } from 'react';
import Button from '@/components/ui/button';
import { gerarRecomendacoes, type Recomendacao } from '@/services/sugestoes';

export default function SugestoesTarefas() {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);

  async function handleGerar() {
    setCarregando(true);
    setErro('');
    setRecomendacoes([]);
    try {
      const { ok, dados } = await gerarRecomendacoes();
      const lista = dados?.data ?? [];
      if (!ok) {
        setErro(dados?.message ?? 'Não foi possível gerar as recomendações.');
      } else if (lista.length === 0) {
        setErro(dados?.message ?? 'Você não tem tarefas pendentes para recomendar.');
      } else {
        setRecomendacoes(lista);
      }
    } catch {
      setErro('Erro de conexão. Verifique sua internet.');
    }
    setCarregando(false);
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold">Tarefas recomendadas para agora</h2>
        <p className="text-xl text-[var(--verde)]">
          A IA escolhe, entre as tarefas que você já cadastrou, as que combinam com a sua emoção. Funciona somente para o dia atual, já que será analisado pelo check-in diário
        </p>
      </div>

      <Button
        texto={carregando ? 'Analisando suas tarefas...' : 'Ver tarefas recomendadas'}
        tamanho="w-full py-4"
        disabled={carregando}
        onClick={handleGerar}
      />

      {erro && <p className="text-center font-medium text-red-500">{erro}</p>}

      {recomendacoes.map((r, i) => (
        <div
          key={r.id}
          className="bg-[var(--creme-escuro)] rounded-2xl p-5 flex flex-col gap-2 shadow-[0_0px_8px_rgba(0,0,0,0.06)]"
        >
          <h3 className="text-xl font-bold">
            {i + 1}. {r.titulo}
          </h3>
          <p className="text-sm">
            Prioridade: <strong>{r.prioridade}</strong> · Dificuldade: <strong>{r.dificuldade}</strong>
            {r.tempo_estimado ? ` · ${r.tempo_estimado} min` : ''}
          </p>
          <p className="text-[var(--verde)]">{r.motivo}</p>
        </div>
      ))}
    </section>
  );
}