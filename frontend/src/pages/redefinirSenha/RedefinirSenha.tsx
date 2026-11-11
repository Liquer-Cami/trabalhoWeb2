import { useSearchParams } from "react-router";
import FormRedefinirSenha from "./components/formRedefinirSenha";
import PainelAutenticacao from "@/components/layout/painelAutenticacao";

export default function RedefinirSenha() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";

    return (
        <main>
            <div className="grid grid-cols-1 grid-cols-2 w-full min-h-screen">
                <PainelAutenticacao />
                <div className="flex items-center justify-center">
                    <FormRedefinirSenha token={token} />
                </div>
            </div>
        </main>
    )
}
