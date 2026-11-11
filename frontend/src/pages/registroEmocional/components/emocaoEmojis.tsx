interface Emocao {
  arquivo: string;
  texto: string;
}

const emocoes: Emocao[] = [
  { arquivo: 'muito-bem', texto: 'Muito bem' },
  { arquivo: 'bem', texto: 'Bem' },
  { arquivo: 'neutro', texto: 'Neutro' },
  { arquivo: 'mal', texto: 'Mal' },
  { arquivo: 'muito-mal', texto: 'Muito mal' },
];

type EmocaoEmojisProps = {
  selected: string;
  onSelect: (arquivo: string) => void;
};

export default function EmocaoEmojis({ selected, onSelect }: EmocaoEmojisProps) {
  return (
    <div className="relative bg-[var(--creme-escuro)] rounded-2xl flex justify-around items-center p-5 shadow-[0_0px_8px_rgba(0,0,0,0.06)]">
      {emocoes.map(({ arquivo, texto }) => (
        <button
          key={arquivo}
          type="button"
          className={`p-5 text-lg rounded-4xl border-2 hover:scale-115 hover:bg-[var(--verde-claro)] focus:scale-115 focus:outline-none focus:ring-brand focus:border-3 focus:border-brand ${arquivo === selected ? 'bg-[var(--verde-claro)] text-[var(--creme-claro)]' : 'bg-[var(--creme-claro)]'}`}
          onClick={() => onSelect(arquivo)}
        >
          <img src={`/${arquivo}.svg`} alt={arquivo} width={100} height={30} />
          {texto}
        </button>
      ))}
    </div>
  );
}
