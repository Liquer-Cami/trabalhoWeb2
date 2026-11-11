import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import SideBar from "@/components/layout/sidebar";
import PainelAutenticacao from "@/components/layout/painelAutenticacao";
import { estaLogado } from "@/services/api";

interface LayoutPublicoProps {
    titulo: string;
    subtitulo?: string;
    children: ReactNode;
}

export default function LayoutPublico({ titulo, subtitulo, children }: LayoutPublicoProps) {
    const navigate = useNavigate();
    const logado = Boolean(estaLogado());

    const conteudo = (
        <>
            <div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-[var(--verde)] text-base font-bold underline hover:opacity-80 transition cursor-pointer mb-2"
                >
                    ← Voltar
                </button>
                <h2 className="text-3xl font-bold">{titulo}</h2>
                {subtitulo && <p className="text-xl text-[var(--verde)]">{subtitulo}</p>}
            </div>
            <div className="flex flex-col gap-6 w-full max-w-4xl">{children}</div>
        </>
    );

    if (logado) {
        return (
            <main>
                <div className="grid lg:grid-cols-[14rem_1fr] min-h-screen">
                    <SideBar />
                    <div className="min-w-0 p-8 flex flex-col gap-6 overflow-y-auto">{conteudo}</div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen">
                <PainelAutenticacao />
                <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-screen">{conteudo}</div>
            </div>
        </main>
    );
}
