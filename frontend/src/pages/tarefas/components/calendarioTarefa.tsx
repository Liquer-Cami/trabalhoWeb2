interface CalendarioTarefaProps {
  dataSelecionada: Date;
  setDataSelecionada: (data: Date) => void;
}

export default function CalendarioTarefa({
  dataSelecionada,
  setDataSelecionada
}: CalendarioTarefaProps) {

  const mes = dataSelecionada.getMonth();
  const ano = dataSelecionada.getFullYear();

  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();

  const primeiroDia = new Date(ano, mes, 1).getDay();

  const nomeMes = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(new Date(ano, mes, 1));

  const dias = Array.from(
    { length: quantidadeDias },
    (_, index) => index + 1
  );

  function selecionarDia(dia: number) {
    const novaData = new Date(ano, mes, dia);

    setDataSelecionada(novaData);
  }

  function mesAnterior() {
    const novaData = new Date(ano, mes - 1, 1);

    setDataSelecionada(novaData);
  }

  function proximoMes() {
    const novaData = new Date(ano, mes + 1, 1);

    setDataSelecionada(novaData);
  }

  return (
    <div className="rounded-2xl bg-[var(--creme-claro)] shadow-[0_0px_8px_rgba(0,0,0,0.06)] w-100 p-4 text-lg">

      <div className="mb-4 flex items-center justify-between">

        <button
          onClick={mesAnterior}
          className="rounded-full px-2 py-1 text-xl text-[var(--verde)] hover:bg-[#DFEBE4]"
        >
          ‹
        </button>

        <h2 className="font-semibold capitalize text-[var(--verde)]">
          {nomeMes} {ano}
        </h2>

        <button
          onClick={proximoMes}
          className="rounded-full px-2 py-1 text-xl text-[var(--verde)] hover:bg-[#DFEBE4]"
        >
          ›
        </button>

      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-sm font-semibold text-gray-500">
        <span>D</span>
        <span>S</span>
        <span>T</span>
        <span>Q</span>
        <span>Q</span>
        <span>S</span>
        <span>S</span>
      </div>

      <div className="grid grid-cols-7 gap-1">

        {Array.from({ length: primeiroDia }).map((_, index) => (
          <div key={`vazio-${index}`} />
        ))}

        {dias.map((dia) => {

          const selecionado =
            dataSelecionada.getDate() === dia &&
            dataSelecionada.getMonth() === mes &&
            dataSelecionada.getFullYear() === ano;

          return (
            <button
              key={dia}
              onClick={() => selecionarDia(dia)}
              className={`
                h-8 w-8 rounded-full text-md transition
                ${selecionado
                  ? "bg-[var(--verde)] text-white"
                  : "text-[var(--verde)] hover:bg-[#DFEBE4]"
                }
              `}
            >
              {dia}
            </button>
          );
        })}

      </div>

    </div>
  );
}

