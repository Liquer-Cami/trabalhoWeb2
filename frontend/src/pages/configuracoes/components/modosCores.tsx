import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTema } from "@/hooks/useTema";

export default function ModosCores() {
    const { tema, setTema } = useTema();

    return (
        <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl items-center justify-around p-5 text-lg">
            <div className="flex flex-col gap-3">
                <h2 className="font-bold">Escolha o modo:</h2>
                <div className="flex gap-5">
                    <div className="flex gap-2">
                        <input type="radio" id="modo-escuro" name="modo-cor" className="w-7 h-7 accent-[var(--verde)]" checked={tema === "dark"}
                            onChange={() => setTema("dark")} />
                        <label htmlFor="modo-escuro">Modo escuro</label>
                        <MoonIcon className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                        <input type="radio" id="modo-claro" name="modo-cor" className="w-7 h-7 accent-[var(--verde)]" checked={tema === "light"}
                            onChange={() => setTema("light")} />
                        <label htmlFor="modo-claro">Modo claro</label>
                        <SunIcon className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    )
}
