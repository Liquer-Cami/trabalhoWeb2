import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { login } from "@/services/auth";
import { useEnvioForm } from "@/hooks/useEnvioForm";

export default function FormLogin() {
    const navigate = useNavigate();
    const { state, pending, onSubmit } = useEnvioForm(login, () => navigate("/registroEmocional"));
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full max-w-md gap-3">
            <div>
                <h1 className="text-2xl">Bem-vindo de volta!</h1>
                <h2 className="text-xl text-[var(--verde)]">Faça login para acessar seu Equilibra.</h2>
            </div>
            <div>
                <p className='text-xl'>Email</p>
                <Input type="email" id="email" name="email" tamanho="text-sm px-4 py-3.5 w-full" placeholder="seuemail@email.com" value={email} onChange={setEmail} required />
            </div>
            <div>
                <p className='text-xl'>Senha</p>
                <Input type="password" id="password" name="senha" tamanho="text-sm px-4 py-3.5 w-full" placeholder="senha" value={senha} onChange={setSenha} required />
            </div>
            <Link to="/emailRecuperacao" className="text-[var(--verde)]  text-lg underline hover:text-[#2E453C]">Esqueceu sua senha?</Link>
            <Button type="submit" texto={pending ? 'Entrando...' : 'Entrar'} tamanho="px-4 py-3.5" disabled={pending} />
            {state?.message && <p className="text-red-600 text-sm">{state.message}</p>}

            <div className="flex flex-row gap-1">
                <p className='text-lg'>Ainda não possui uma conta?</p>
                <Link to="/cadastro" className="text-[var(--verde)] text-lg underline hover:text-[#2E453C]">Criar conta</Link>
            </div>

            <div className="pt-2 text-center flex items-center justify-center gap-3 text-xs text-[var(--verde)]">
                <Link to="/termos" className="underline hover:opacity-80">
                    Termos & LGPD
                </Link>
                <span>•</span>
                <Link to="/faleConosco" className="underline hover:opacity-80">
                    Fale conosco
                </Link>
                <span>•</span>
                <Link to="/estrategias" className="underline hover:opacity-80">
                    Estratégias de autorregulação
                </Link>
            </div>
        </form>
    )
}
