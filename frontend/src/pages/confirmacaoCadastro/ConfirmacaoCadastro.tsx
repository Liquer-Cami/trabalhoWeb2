import { Link } from "react-router";
import PainelAutenticacao from "@/components/layout/painelAutenticacao";

export default function ConfirmacaoCadastro() {
    return (
        <main>
            <div className="grid grid-cols-1 grid-cols-2 w-full min-h-screen">
                <PainelAutenticacao />
                <div className="flex items-center justify-center flex-col">
                    <h1 className="text-2xl">Usuário cadastrado com sucesso!</h1>
                    <h2 className="text-xl">Pronto! Agora só fazer login para acessar seu Equilibra.</h2>
                    <Link to="/login" className="text-[var(--verde)] underline hover:text-[#2E453C] grid gap-5 text-lg">Clique aqui para fazer login</Link>
                </div>
            </div>
        </main>
    )
}
