interface ButtonProps {
    type?: "submit" | "reset" | "button";
    texto: string;
    tamanho: string;
    name?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function Button({ type = "button", texto, tamanho, onClick, name, disabled }: ButtonProps) {
    return (
        <button type={type} disabled={disabled} name={name} className={`text-white bg-[var(--verde)] box-border border border-transparent hover:bg-[#2E453C] shadow-xs font-medium leading-5 rounded-lg ${tamanho} focus:outline-none`}
            onClick={() => { onClick?.() }}>{texto}</button>
    )
}
