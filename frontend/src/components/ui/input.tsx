interface InputProps {
    type: string;
    id: string;
    placeholder?: string;
    tamanho: string;
    corBorda?: string;
    name?: string;
    required?: boolean;
    minLength?: number;
    value?: string;
    onChange?: (value: string) => void;
}

export default function Input({ name, type, id, tamanho, corBorda, placeholder, value, required, minLength, onChange }: InputProps) {
    return (
        <input type={type} name={name} value={value} id={id} minLength={minLength} className={`bg-[var(--creme-claro)] accent-[var(--verde)] border border-default-medium ${corBorda ?? ""} rounded-md text-heading rounded-base focus:outline-none focus:ring-brand focus:border-brand focus:border-2 block ${tamanho} shadow-xs placeholder:text-body`} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} required={required} />
    )
}
