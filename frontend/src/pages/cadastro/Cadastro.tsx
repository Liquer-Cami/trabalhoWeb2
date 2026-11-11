import FormCadastro from "./components/formCadastro";
import PainelAutenticacao from "@/components/layout/painelAutenticacao";

export default function Cadastro() {
    return (
        <main>
            <div className="grid grid-cols-1 grid-cols-2 w-full min-h-screen">
                <PainelAutenticacao />
                <div className="flex items-center justify-center">
                    <FormCadastro />
                </div>
            </div>
        </main>
    )
}
