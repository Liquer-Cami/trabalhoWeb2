import type { ReactNode } from "react";

interface InfoCardProps {
    titulo: string;
    texto: ReactNode;
    tamanho: string;
    imagem: string;
    info_imagem: string;
    largura_imagem: number;
    altura_imagem: number;
}

export default function InfoCard({ titulo, texto, imagem, info_imagem, largura_imagem, altura_imagem, tamanho }: InfoCardProps) {
    return (
        <div>
            <aside className="p-1 flex flex-col gap-4 overflow-y-auto">
                <div className={`bg-[var(--creme-claro)] rounded-4xl ${tamanho} shadow-[0_0px_8px_rgba(0,0,0,0.06)] flex flex-col justify-center items-center`}>
                    <div className="flex flex-col gap-3 items-center">
                        {largura_imagem > 0 && altura_imagem > 0 && (
                            <img
                                src={imagem}
                                alt={info_imagem}
                                width={largura_imagem}
                                height={altura_imagem}
                            />
                        )}
                        <h3 className="font-bold flex items-center gap-2 mb-2 text-xl">
                            {titulo}
                        </h3>
                    </div>
                    <div className="text-lg text-[var(--verde)]">
                        {texto}
                    </div>
                </div>
            </aside>
        </div>
    )
}
