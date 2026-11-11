import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { redefinirSenha } from "@/services/auth";
import { useEnvioForm } from "@/hooks/useEnvioForm";

export default function FormRedefinirSenha({ token }: { token: string }) {
    const navigate = useNavigate();
    const { state, pending, onSubmit } = useEnvioForm(redefinirSenha, () => navigate("/login"));
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full max-w-md gap-3">
            <div>
                <h1 className="text-2xl">Redefinir senha!</h1>
                <h2 className="text-xl text-[var(--verde)]">Mude sua senha para acessar o Equilibra.</h2>
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
            <input type="hidden" name="token" value={token}></input>
            <div>
                <p className='text-md'>A senha deverá ter:</p>
                <ul className="list-disc list-inside">
                    <li>Pelo menos 8 caracteres</li>
                    <li>Pelo menos 1 letra</li>
                    <li>Pelo menos 1 número</li>
                    <li>Pelo menos 1 caractere especial</li>
                </ul>
            </div>
            <Button type="submit" texto={pending ? 'Redefinindo...' : 'Redefinir'} tamanho="px-4 py-3.5" disabled={pending} />
            {state?.message && <p className="text-red-600 text-sm">{state.message}</p>}

        </form>
    )
}
