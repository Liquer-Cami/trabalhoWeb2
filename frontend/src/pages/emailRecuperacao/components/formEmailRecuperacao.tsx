import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { emailRecuperacao } from "@/services/auth";

export default function FormEmailRecuperacao() {
    const [email, setEmail] = useState("");
    const [pending, setPending] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setMensagemErro(null);
        setMensagemSucesso(null);

        if (!email.trim()) {
            setMensagemErro("Preencha o seu e-mail.");
            return;
        }

        setPending(true);

        const formData = new FormData();
        formData.append("email", email.trim());

        const resultado = await emailRecuperacao(formData);
        setPending(false);

        if (resultado?.sucesso) {
            setMensagemSucesso(resultado.message ?? "E-mail de recuperação enviado com sucesso!");
        } else {
            setMensagemErro(resultado?.message ?? "Não foi possível enviar o e-mail de recuperação.");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md gap-3">
            <div>
                <h1 className="text-2xl font-bold">Recupere sua senha!</h1>
                <h2 className="text-xl text-[var(--verde)]">Digite o e-mail do seu cadastro.</h2>
            </div>

            {mensagemSucesso && (
                <div className="p-4 bg-[var(--verde-claro)] text-[var(--verde)] rounded-2xl font-medium border border-[var(--verde)] flex flex-col gap-2">
                    <p className="font-bold">✓ {mensagemSucesso}</p>
                    <p className="text-sm">
                        Se o endereço estiver cadastrado, confira sua caixa de entrada e a pasta de spam.
                    </p>
                </div>
            )}

            {mensagemErro && (
                <div className="p-3 bg-red-50 text-red-700 rounded-2xl text-sm font-medium border border-red-200">
                    {mensagemErro}
                </div>
            )}

            <div>
                <p className="text-lg">E-mail</p>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    tamanho="text-sm px-4 py-3.5 w-full"
                    placeholder="seuemail@email.com"
                    value={email}
                    onChange={setEmail}
                    required
                />
            </div>

            <Link to="/login" className="text-[var(--verde)] text-lg underline hover:text-[#2E453C]">
                Voltar para o Login!
            </Link>

            <Button
                type="submit"
                texto={pending ? "Enviando e-mail..." : "Enviar E-mail de Recuperação"}
                tamanho="px-4 py-3.5"
                disabled={pending}
            />

            <div className="flex flex-row gap-1 pt-2">
                <p className="text-lg">Ainda não possui uma conta?</p>
                <Link to="/cadastro" className="text-[var(--verde)] text-lg underline hover:text-[#2E453C]">
                    Criar conta
                </Link>
            </div>
        </form>
    );
}
