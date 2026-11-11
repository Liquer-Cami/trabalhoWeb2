type ObservacaoProps = {
  value: string;
  onChange: (v: string) => void;
};

export default function Observacao({ value, onChange }: ObservacaoProps) {
  return (
    <div className="relative bg-[var(--creme-escuro)] rounded-2xl p-5 w-full shadow-[0_0px_8px_rgba(0,0,0,0.06)]">
      <div className="w-full">
        <textarea
          name="text"
          id="observacao"
          placeholder="Escreva o que estiver passando pela sua cabeça."
          className="bg-[var(--creme-claro)] border border-[var(--verde)] border-default-medium rounded-2xl text-heading rounded-base focus:outline-none focus:ring-brand focus:border-brand focus:border-2 block w-full h-40 p-3 shadow-xs placeholder:text-body"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
