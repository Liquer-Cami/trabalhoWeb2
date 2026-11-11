import PainelAutenticacao from "@/components/layout/painelAutenticacao";
import FormEmailRecuperacao from "./components/formEmailRecuperacao";

export default function EmailRecuperacao() {
    return (
        <main>
            <div className="grid grid-cols-1 grid-cols-2 w-full min-h-screen">
                <PainelAutenticacao />
                <div className="flex items-center justify-center">
                    <FormEmailRecuperacao />
                </div>
            </div>
        </main>
    )
}
