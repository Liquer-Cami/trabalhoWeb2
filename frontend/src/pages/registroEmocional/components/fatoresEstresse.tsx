import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import ButtonSelect from '@/components/ui/buttonSelect';

const fatoresPadrao = [
  'Som alto',
  'Trabalho',
  'Família',
  'Ansiedade',
  'Texturas',
];

type FatoresEstresseProps = {
  selected: string[];
  onToggle: (fator: string) => void;
};

export default function FatoresEstresse({ selected, onToggle }: FatoresEstresseProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [novoFator, setNovoFator] = useState('');
  const [fatoresCustom, setFatoresCustom] = useState<string[]>([]);

  const todosFatores = [...fatoresPadrao, ...fatoresCustom];

  function handleAdicionarFator() {
    const limpo = novoFator.trim();
    if (limpo && !todosFatores.includes(limpo)) {
      setFatoresCustom((prev) => [...prev, limpo]);
      onToggle(limpo); // já seleciona ao adicionar
    }
    setNovoFator('');
    setModalAberto(false);
  }

  return (
    <div className="relative bg-[var(--creme-escuro)] rounded-2xl flex justify-center flex-wrap gap-4 p-6 items-center shadow-[0_0px_8px_rgba(0,0,0,0.06)]">
      {todosFatores.map((fator) => (
        <ButtonSelect
          key={fator}
          texto={fator}
          tamanho="px-6 py-4 text-lg"
          cor={`bg-[var(--creme-claro)] text-[var(--verde)] border-[var(--verde)] hover:bg-[var(--verde-claro)] focus:bg-[var(--verde-claro)] ${selected.includes(fator) ? 'bg-[var(--verde-claro)] text-[var(--verde)]' : ''}`}
          onClick={() => onToggle(fator)}
        />
      ))}

      <button
        type="button"
        onClick={() => setModalAberto(true)}
        aria-label="Adicionar fator de estresse"
      >
        <PlusCircleIcon className="w-9 h-9 text-[var(--verde)] bg-[var(--creme-escuro)] rounded-4xl hover:bg-[var(--verde-claro)] focus:ring-brand focus:border-3 focus:border-brand focus:bg-[var(--verde-claro)]" aria-label="Adicionar fator de estresse" />
      </button>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-[var(--background)] rounded-2xl p-8 w-[500px] flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Adicionar fator</h2>
            <Input
              type="text"
              id="novo_fator"
              tamanho="w-full p-3"
              corBorda="border-[var(--verde)]"
              placeholder="Digite um fator de estresse"
              value={novoFator}
              onChange={(v: string) => setNovoFator(v)}
            />
            <div className="flex justify-end gap-3">
              <Button texto="Cancelar" tamanho="px-8 py-4" onClick={() => setModalAberto(false)} />
              <Button texto="Adicionar" tamanho="px-8 py-4" onClick={handleAdicionarFator} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
