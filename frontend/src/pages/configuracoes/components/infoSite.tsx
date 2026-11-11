import { Link } from "react-router";

export default function InfoSite() {
    return (
        <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl items-center justify-around p-5 text-lg">
            <div className="flex flex-col gap-5 w-full">
                <div>
                    <p className="font-bold">Sobre: </p>
                    <p>Plataforma criada por uma autista, pensada para outros neurodivergentes,
                        desenvolvida para respeitar diferentes ritmos, necessidades e formas de organização.
                    </p>
                </div>
                <div>
                    <p className="font-bold">Acessibilidade: </p>
                    <p>Plataforma com interface simples, previsível e com baixo estímulo visual, respeitando o WGC e GAIA.</p>
                </div>
                <div><p className="font-bold">Versão: </p><p>V1.0</p></div>
                <div><p className="font-bold">Criadora:</p><p>Camila Liquer Pinto.</p></div>

                <div className="pt-2 border-t border-[var(--hover-creme-escuro)]">
                    <Link
                        to="/termos"
                        className="text-[var(--verde)] font-bold text-base underline hover:opacity-80 transition block"
                    >
                        📜 Termos de Serviço, LGPD e Autoria →
                    </Link>
                    <Link
                        to="/estrategias"
                        className="text-[var(--verde)] font-bold text-base underline hover:opacity-80 transition block mt-3"
                    >
                        🌿 Estratégias de autorregulação →
                    </Link>
                </div>
            </div>
        </div>
    );
}
