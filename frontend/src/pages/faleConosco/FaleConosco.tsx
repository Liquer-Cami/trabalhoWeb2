import { Link } from "react-router";
import SideBar from "@/components/layout/sidebar";
import PainelAutenticacao from "@/components/layout/painelAutenticacao";
import FormFaleConosco from "./components/formFaleConosco";
import { estaLogado } from "@/services/api";

export default function FaleConosco() {
    const logado = Boolean(estaLogado());

    if (logado) {
        return (
            <main className="grid grid-cols-[14rem_1fr] min-h-screen bg-[var(--background)]">
                <SideBar />
                <div className="flex items-center justify-center p-8">
                    <FormFaleConosco />
                </div>
            </main>
        );
    }

    return (
        <main className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen bg-[var(--background)]">
            <PainelAutenticacao />
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                <FormFaleConosco />
                <Link
                    to="/login"
                    className="text-[var(--verde)] text-base underline hover:opacity-80 transition"
                >
                    ← Voltar para o Login
                </Link>
            </div>
        </main>
    );
}
