import type { ReactNode } from "react";

interface CardResumoProps{
    titulo: string;
    valor: ReactNode,
    cor: string
}

export default function CardResumo({ titulo, valor, cor}: CardResumoProps) {
    return (
        <div>
         <div>
             <div className={`${cor} bg-[var(--creme-claro)] rounded-xl p-4 shadow-[0_0px_8px_rgba(0,0,0,0.06)] flex flex-col justify-center items-center`}>
                 <div className="flex flex-col gap-3 items-center">
                     <h3 className="font-bold flex items-center text-xl">
                         {titulo}
                     </h3>
                     <h2 className="flex items-center text-lg flex-col gap-2">{valor}</h2>
                 </div>
             </div>
         </div>
        </div>
    )
}