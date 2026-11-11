import FormLogin from "./components/formLogin";
import PainelAutenticacao from "@/components/layout/painelAutenticacao";

export default function Login() {
    return (
        <main>
            <div className="grid grid-cols-1 grid-cols-2 w-full min-h-screen">
                <PainelAutenticacao />
                <div className="flex items-center justify-center">
                    <FormLogin />
                </div>
            </div>
        </main>
    )
}
