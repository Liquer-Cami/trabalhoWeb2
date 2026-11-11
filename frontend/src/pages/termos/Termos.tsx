import { useNavigate } from "react-router";
import SideBar from "@/components/layout/sidebar";
import PainelAutenticacao from "@/components/layout/painelAutenticacao";
import { estaLogado } from "@/services/api";

export default function Termos() {
    const navigate = useNavigate();
    const logado = Boolean(estaLogado());

    const cartoesConteudo = (
        <div className="flex flex-col gap-6 w-full max-w-4xl">

            <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl p-6 text-lg gap-3">
                <h3 className="text-2xl font-bold">Termos de Uso</h3>
                <p>
                    O <strong>Equilibra</strong> é uma plataforma pensada para apoiar pessoas neurodivergentes na organização de rotina, tarefas e no acompanhamento emocional com baixo estímulo visual.
                </p>
                <div>
                    <p className="font-bold">Aviso importante:</p>
                    <p>
                        A ferramenta tem caráter de suporte pessoal e de rotina. Ela <strong>não substitui</strong> consultas, diagnósticos ou acompanhamentos médicos, psicológicos ou terapêuticos.
                    </p>
                </div>
            </div>

            <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl p-6 text-lg gap-3">
                <h3 className="text-2xl font-bold">Privacidade e LGPD</h3>
                <p>
                    Seguimos as regras da Lei Geral de Proteção de Dados (Lei nº 13.709/2018):
                </p>
                <div>
                    <p className="font-bold">Dados que guardamos:</p>
                    <p>Apenas nome, e-mail, senha protegida por criptografia e seus registros de rotina e emoções.</p>
                </div>
                <div>
                    <p className="font-bold">Como usamos:</p>
                    <p>Seus dados são usados unicamente para você visualizar seu próprio histórico. Jamais compartilhamos ou vendemos suas informações.</p>
                </div>
                <div>
                    <p className="font-bold">Seus direitos:</p>
                    <p>Você pode pedir a consulta, alteração ou exclusão total da sua conta e de todos os seus dados a qualquer momento pelo Fale Conosco.</p>
                </div>
            </div>

            <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl p-6 text-lg gap-3">
                <h3 className="text-2xl font-bold">Política de Plágio e Autoria</h3>
                <div>
                    <p className="font-bold">Autoria:</p>
                    <p>Projeto concebido e desenvolvido por <strong>Camila Liquer Pinto</strong>.</p>
                </div>
                <div>
                    <p className="font-bold">Direitos autorais e integridade:</p>
                    <p>
                        É proibida a cópia, reprodução ou plágio do código-fonte, layout ou conteúdo deste sistema para trabalhos de terceiros sem autorização prévia e citação formal (Lei nº 9.610/1998).
                    </p>
                </div>
            </div>
        </div>
    );

    if (logado) {
        return (
            <main>
                <div className="grid lg:grid-cols-[14rem_1fr] min-h-screen">
                    <SideBar />
                    <div className="min-w-0 p-8 flex flex-col gap-6 overflow-y-auto">
                        <div>
                            <div className="flex gap-2 items-center">
                                <h2 className="text-3xl font-bold">Termos e Privacidade</h2>
                            </div>
                            <p className="text-xl text-[var(--verde)]">
                                Nossas diretrizes de uso, proteção de dados e direitos autorais.
                            </p>
                        </div>

                        {cartoesConteudo}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-screen">
                <PainelAutenticacao />
                <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-screen">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="text-[var(--verde)] text-base font-bold underline hover:opacity-80 transition cursor-pointer mb-2"
                        >
                            ← Voltar
                        </button>
                        <h2 className="text-3xl font-bold">Termos e Privacidade</h2>
                        <p className="text-xl text-[var(--verde)]">
                            Nossas diretrizes de uso, proteção de dados e direitos autorais.
                        </p>
                    </div>

                    {cartoesConteudo}
                </div>
            </div>
        </main>
    );
}
