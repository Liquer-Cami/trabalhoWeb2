interface ButtonSelectProps {
    texto: string;
    tamanho: string;
    cor: string;
    onClick?: () => void;
}

export default function ButtonSelect({ texto, tamanho, cor, onClick }: ButtonSelectProps) {
    return (
        <button type="button" className={`${cor} font-bold rounded-4xl border  border-2 focus:ring-brand focus:border-3 focus:border-brand ${tamanho}`}
            onClick={() => { onClick?.() }}>{texto}</button>
    )
}
