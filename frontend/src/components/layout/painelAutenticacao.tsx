export default function PainelAutenticacao() {
    return (
        <div className="bg-[var(--creme-escuro)] text-center flex flex-col items-center justify-center gap-3">
            <img
                src="/girassol.png"
                alt="girassol"
                width={100}
                height={200}
            />
            <div>
                <h1 className="text-3xl text-[var(--verde)] font-bold">Equilibra</h1>
                <h2 className="text-xl text-[var(--verde)]">Entenda seu ritmo. Adapte suas tarefas. Encontre seu equilíbrio.</h2>
            </div>
        </div>
    )
}
