import { useState } from 'react';
import Button from '@/components/ui/button';
import { enviarCheckin } from '@/services/checkin';
import EmocaoEmojis from './components/emocaoEmojis';
import FatoresEstresse from './components/fatoresEstresse';
import InfoCard from '@/components/ui/infoCard';
import Observacao from '@/components/ui/observacao';
import SideBar from '@/components/layout/sidebar';

export default function RegistroEmocional() {
  const [emocao, setEmocao] = useState('');
  const [fatores, setFatores] = useState<string[]>([]);
  const [observacao, setObservacao] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleToggleFator = (fator: string) => {
    setFatores((prev) =>
      prev.includes(fator) ? prev.filter((f) => f !== fator) : [...prev, fator]
    );
  };

  const handleSubmit = async () => {
    if (!emocao) {
      setMensagem('Selecione uma emoção antes de enviar.');
      setSucesso(false);
      return;
    }
    try {
      const response = await enviarCheckin({ emoticon: emocao, fatores, observacao });
      const { ok, dados } = response;
      if (ok && dados?.status === 'success') {
        setSucesso(true);
        setMensagem('Check-in enviado com sucesso! 🎉');
        setEmocao('');
        setFatores([]);
        setObservacao('');
      } else {
        setSucesso(false);
        setMensagem(dados?.message || 'Erro ao enviar. Tente novamente.');
      }
    } catch {
      setSucesso(false);
      setMensagem('Erro de conexão. Verifique sua internet.');
    }
  };

  return (
    <main>
      <div className="grid lg:grid-cols-[14rem_1fr_20rem] min-h-screen">
        <SideBar />

        <div className="min-w-0 p-8 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-bold mt-2">Check-in diário</h1>
            <h2 className="text-xl text-[var(--verde)]">Como está se sentindo hoje?</h2>
          </div>

          <EmocaoEmojis selected={emocao} onSelect={setEmocao} />

          <div>
            <div className="flex gap-2 items-center">
              <h2 className="text-2xl font-bold">Fatores de estresse (Opcional)</h2>
            </div>
            <p className="text-xl text-[var(--verde)]">O que pode estar afetando seu dia? (Selecione um ou mais fatores se quiser)</p>
          </div>

          <FatoresEstresse selected={fatores} onToggle={handleToggleFator} />

          <div>
            <div className="flex gap-2 items-center">
              <h2 className="text-2xl font-bold">Observação (Opcional)</h2>
            </div>
            <p className="text-xl text-[var(--verde)]">Há algo que você gostaria de compartilhar?</p>
          </div>

          <Observacao value={observacao} onChange={setObservacao} />

          <Button texto="Finalizar Check-In" tamanho="w-full py-5" onClick={handleSubmit} />

          {mensagem && (
            <p className={`text-center font-medium mt-2 ${sucesso ? 'text-[var(--verde)]' : 'text-red-500'}`}>
              {mensagem}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-5 pt-30">
          <InfoCard
            titulo="Por que fazer o check-in?"
            texto="Seu check-in ajuda o Equilibra a adaptar sua rotina ao seu estado atual."
            imagem="/girassol.png"
            largura_imagem={90}
            altura_imagem={150}
            info_imagem="girassol-card"
            tamanho="p-4"
          />
          <InfoCard
            titulo="Dica!"
            texto="Você não precisa preencher tudo. Registre apenas o que quiser compartilhar."
            imagem="/lampada.svg"
            largura_imagem={70}
            altura_imagem={70}
            info_imagem="lampada-card"
            tamanho="p-4"
          />
        </div>
      </div>
    </main>
  );
}
