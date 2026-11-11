import Input from "@/components/ui/input";

export default function Tipografia() {
    return (
        <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl items-center justify-around p-5 text-lg gap-5">
            <div className="flex flex-col gap-3">
                <h2 className="font-bold">Escolha o tipo da fonte:</h2>
                <select name="opcao" className="bg-[var(--creme-claro)] rounded-full p-3 border-[var(--verde)] border-2 focus:outline-none ">
                    <option value="Atkinson">Atkinson Hyperlegible (padrão)</option>
                    <option value="Lexend">Lexend</option>
                    <option value="Nunito Sans">Nunito Sans</option>
                </select>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="font-bold">Escolha o tamanho da fonte:</h2>
                <div className="flex justify-around gap-5">
                    <div className="flex gap-2">
                        <Input type="radio" id="pequena" tamanho="w-7 h-7 accent-[var(--verde)]" />
                        <label htmlFor="pequena">Pequena</label>
                    </div>
                    <div className="flex gap-2">
                        <Input type="radio" id="media" tamanho="w-7 h-7 accent-[var(--verde)]" />
                        <label htmlFor="media">Média</label>
                    </div>
                    <div className="flex gap-2">
                        <Input type="radio" id="grande" tamanho="w-7 h-7 accent-[var(--verde)]" />
                        <label htmlFor="grande">Grande</label>
                    </div>
                </div>
            </div>
        </div>
    )
}