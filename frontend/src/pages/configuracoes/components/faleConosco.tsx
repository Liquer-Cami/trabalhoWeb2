import { useState, type FormEvent } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { enviarContato } from "@/services/contato";
import { lerUsuario } from "@/services/api";

export default function FaleConosco() {
    const usuario = lerUsuario();
    const [assunto, setAssunto] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [enviando, setEnviando] = useState(false);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    // Validação em JavaScript
    function validar(): string | null {
        if (!assunto.trim() || assunto.trim().length < 3) {
            return "Por favor, digite o assunto da mensagem (mínimo 3 caracteres).";
        }
        if (!mensagem.trim() || mensagem.trim().length < 10) {
            return "A mensagem deve conter pelo menos 10 caracteres.";
        }
        return null;
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErro(null);
        setSucesso(null);

        const erroValidacao = validar();
        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }

        setEnviando(true);

        try {
            // Usa automaticamente o nome e o email do usuário logado
            const resposta = await enviarContato({
                nome: usuario?.nome ?? "Usuário",
                email: usuario?.email ?? "usuario@equilibra.com",
                assunto: assunto.trim(),
                mensagem: mensagem.trim(),
            });

            if (resposta.ok) {
                setSucesso(resposta.dados?.message ?? "Mensagem enviada com sucesso!");
                setAssunto("");
                setMensagem("");
            } else {
                setErro(resposta.dados?.message ?? "Não foi possível enviar sua mensagem.");
            }
        } catch {
            setErro("Erro ao conectar ao servidor. Verifique se o backend está ligado.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl p-5 gap-4">
            {sucesso && (
                <div className="p-3 bg-[var(--verde-claro)] text-[var(--verde)] rounded-xl text-sm font-semibold border border-[var(--verde)]">
                    ✓ {sucesso}
                </div>
            )}

            {erro && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-200">
                    {erro}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label htmlFor="contato-assunto" className="font-bold text-base">
                        Assunto:
                    </label>
                    <Input
                        type="text"
                        id="contato-assunto"
                        name="assunto"
                        placeholder="Ex: Sugestão ou dúvida sobre o Equilibra"
                        tamanho="text-sm px-4 py-2.5 w-full"
                        value={assunto}
                        onChange={setAssunto}
                        required
                        minLength={3}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="contato-mensagem" className="font-bold text-base">
                        Mensagem:
                    </label>
                    <textarea
                        id="contato-mensagem"
                        name="mensagem"
                        rows={5}
                        required
                        minLength={10}
                        placeholder="Escreva sua mensagem aqui com pelo menos 10 caracteres..."
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        className="w-full text-sm px-4 py-2.5 rounded-md border border-default-medium bg-[var(--creme-claro)] focus:outline-none focus:border-[var(--verde)] focus:border-2 shadow-xs resize-none placeholder:text-body"
                    />
                </div>

                <div className="pt-1">
                    <Button
                        type="submit"
                        texto={enviando ? "Enviando e-mail..." : "Enviar Mensagem"}
                        tamanho="w-full py-3.5"
                        disabled={enviando}
                    />
                </div>
            </form>
        </div>
    );
}
