import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { cadastro } from "@/services/auth";
import { useEnvioForm } from "@/hooks/useEnvioForm";

export default function FormCadastro() {
    const navigate = useNavigate();
    const { state, pending, onSubmit } = useEnvioForm(cadastro, () => navigate("/confirmacaoCadastro"));
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [previewFoto, setPreviewFoto] = useState<string | null>(null);

    function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
        const arquivo = e.target.files?.[0];
        if (arquivo) {
            setPreviewFoto(URL.createObjectURL(arquivo));
        } else {
            setPreviewFoto(null);
        }
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full max-w-md gap-3">
            <div>
                <h1 className="text-2xl">Boas-vindas ao Equilibra!</h1>
                <h2 className="text-xl text-[var(--verde)]">Faça seu cadastro para criar seu Equilibra.</h2>
            </div>

            {/* Campo de Foto do Usuário (Salva em arquivo no backend) */}
            <div className="flex flex-col items-center gap-1 my-1">
                <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-[var(--verde)] flex items-center justify-center overflow-hidden bg-[var(--creme-claro)] hover:opacity-90 transition cursor-pointer">
                    {previewFoto ? (
                        <img src={previewFoto} alt="Prévia da foto" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-center p-1 text-xs text-[var(--verde)]">
                            <span className="text-2xl">📷</span>
                            <span className="font-semibold mt-1">Sua foto</span>
                        </div>
                    )}
                    <input
                        type="file"
                        id="foto"
                        name="foto"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleFotoChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <p className="text-sm text-[var(--verde)]">Foto de perfil (opcional)</p>
            </div>

            <div>
                <p className='text-lg'>Como gostaria de ser chamado?</p>
                <Input type="text" id="nome" name="nome" tamanho="text-sm px-4 py-3.5 w-full" placeholder="seu nome" value={nome} onChange={setNome} required />
                {state?.errors?.nome && (
                    <p role="alert" className="text-sm text-red-600">
                        {state.errors.nome[0]}
                    </p>
                )}
            </div>
            <div>
                <p className='text-lg'>Email</p>
                <Input type="email" id="email" name="email" tamanho="text-sm px-4 py-3.5 w-full" placeholder="seuemail@email.com" value={email} onChange={setEmail} required />
                {state?.errors?.email && (
                    <p role="alert" className="text-sm text-red-600">
                        {state.errors.email[0]}
                    </p>
                )}
            </div>
            <div>
                <p className='text-lg'>Senha</p>
                <Input type="password" id="senha" name="senha" tamanho="text-sm px-4 py-3.5 w-full" placeholder="senha" value={senha} onChange={setSenha} required />
                {state?.errors?.senha && (
                    <p role="alert" className="text-sm text-red-600">
                        {state.errors.senha[0]}
                    </p>
                )}
            </div>
            <div>
                <p className='text-lg'>Confirmar senha</p>
                <Input type="password" id="confirmaSenha" name="confirmaSenha" tamanho="text-sm px-4 py-3.5 w-full" placeholder="senha" value={confirmarSenha} onChange={setConfirmarSenha} required />
            </div>
            <div>
                <p className='text-md'>A senha deverá ter:</p>
                <ul className="list-disc list-inside">
                    <li>Pelo menos 8 caracteres</li>
                    <li>Pelo menos 1 letra</li>
                    <li>Pelo menos 1 número</li>
                    <li>Pelo menos 1 caractere especial</li>
                </ul>
            </div>

            <div className="text-xs text-center text-[var(--verde)] opacity-90 my-1">
                Ao se cadastrar, você concorda com nossos{" "}
                <Link to="/termos" target="_blank" className="font-bold underline hover:opacity-80">
                    Termos de Uso e Política de LGPD
                </Link>
                .
            </div>

            <Button type="submit" texto={pending ? 'Cadastrando...' : 'Cadastrar'} tamanho="px-4 py-3.5" disabled={pending} />
            {state?.message && <p className="text-red-600 text-sm">{state.message}</p>}

            <div className="flex flex-row gap-1">
                <p className='text-lg'>Já possui uma conta?</p>
                <Link to="/login" className="text-[var(--verde)] text-lg underline hover:text-[#2E453C]">Fazer login</Link>
            </div>
        </form>
    )
}
