import { useState, type FormEvent } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { enviarContato } from "@/services/contato";

export default function FormFaleConosco() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [assunto, setAssunto] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);

    function validar(): string | null {
        if (!nome.trim() || nome.trim().length < 2) {
            return "Por favor, digite seu nome (mínimo de 2 caracteres).";
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return "Por favor, informe um endereço de e-mail válido.";
        }
        if (!assunto.trim() || assunto.trim().length < 3) {
            return "Por favor, digite o assunto da mensagem.";
        }
        if (!mensagem.trim() || mensagem.trim().length < 10) {
            return "Sua mensagem deve conter pelo menos 10 caracteres.";
        }
        return null;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setMensagemErro(null);
        setMensagemSucesso(null);

        // 1. Executa validação em JS
        const erroValidacao = validar();
        if (erroValidacao) {
            setMensagemErro(erroValidacao);
            return;
        }

        setEnviando(true);

        try {
            const resposta = await enviarContato({
                nome: nome.trim(),
                email: email.trim(),
                assunto: assunto.trim(),
                mensagem: mensagem.trim(),
            });

            if (resposta.ok) {
                setMensagemSucesso(resposta.dados?.message ?? "Mensagem enviada com sucesso!");
                setNome("");
                setEmail("");
                setAssunto("");
                setMensagem("");
            } else {
                setMensagemErro(resposta.dados?.message ?? "Não foi possível enviar sua mensagem. Tente novamente.");
            }
        } catch {
            setMensagemErro("Erro ao conectar ao servidor. Verifique se o backend está ligado.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="flex flex-col w-full max-w-lg gap-4 p-8 bg-[var(--creme-claro)] rounded-3xl shadow-sm">
            <div>
                <h1 className="text-3xl font-bold text-[var(--verde)]">Fale Conosco</h1>
                <h2 className="text-lg text-[var(--verde)] opacity-90">
                    Envie sua dúvida, sugestão ou mensagem diretamente para nossa equipe.
                </h2>
            </div>

            {mensagemSucesso && (
                <div className="p-4 bg-[var(--verde-claro)] text-[var(--verde)] rounded-2xl font-medium border border-[var(--verde)] flex flex-col gap-2">
                    <p className="font-bold">✓ {mensagemSucesso}</p>
                    <p className="text-sm">Um e-mail foi registrado e enviado através do backend em PHP.</p>
                    <button
                        type="button"
                        onClick={() => setMensagemSucesso(null)}
                        className="text-xs text-[var(--verde)] underline self-start cursor-pointer hover:opacity-80"
                    >
                        Enviar outra mensagem
                    </button>
                </div>
            )}

            {mensagemErro && (
                <div className="p-3 bg-red-50 text-red-700 rounded-2xl text-sm font-medium border border-red-200">
                    {mensagemErro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label htmlFor="nome-contato" className="text-base font-semibold block mb-1">
                        Seu Nome *
                    </label>
                    <Input
                        type="text"
                        id="nome-contato"
                        name="nome"
                        placeholder="Como podemos te chamar?"
                        tamanho="text-sm px-4 py-3 w-full"
                        value={nome}
                        onChange={setNome}
                        required
                        minLength={2}
                    />
                </div>
                <div>
                    <label htmlFor="email-contato" className="text-base font-semibold block mb-1">
                        Seu E-mail *
                    </label>
                    <Input
                        type="email"
                        id="email-contato"
                        name="email"
                        placeholder="seuemail@exemplo.com"
                        tamanho="text-sm px-4 py-3 w-full"
                        value={email}
                        onChange={setEmail}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="assunto-contato" className="text-base font-semibold block mb-1">
                        Assunto *
                    </label>
                    <Input
                        type="text"
                        id="assunto-contato"
                        name="assunto"
                        placeholder="Ex: Dúvida sobre o registro diário"
                        tamanho="text-sm px-4 py-3 w-full"
                        value={assunto}
                        onChange={setAssunto}
                        required
                        minLength={3}
                    />
                </div>
                <div>
                    <label htmlFor="mensagem-contato" className="text-base font-semibold block mb-1">
                        Mensagem *
                    </label>
                    <textarea
                        id="mensagem-contato"
                        name="mensagem"
                        rows={5}
                        required
                        minLength={10}
                        placeholder="Escreva sua mensagem com pelo menos 10 caracteres..."
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        className="w-full text-sm px-4 py-3 rounded-2xl border border-[var(--creme-escuro)] bg-[var(--background)] focus:outline-none focus:border-[var(--verde)] transition-colors resize-none"
                    />
                </div>
                <div className="pt-2">
                    <Button
                        type="submit"
                        texto={enviando ? "Enviando e-mail..." : "Enviar Mensagem"}
                        tamanho="w-full py-4 text-base"
                        disabled={enviando}
                    />
                </div>
            </form>
        </div>
    );
}
