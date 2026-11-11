import { Link } from "react-router";

export default function NaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="text-lg">O endereço acessado não existe.</p>
      <Link to="/" className="text-[var(--verde)] underline">
        Voltar ao início
      </Link>
    </main>
  );
}
