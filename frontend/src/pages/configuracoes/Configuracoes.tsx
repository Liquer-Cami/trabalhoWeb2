import SideBar from "@/components/layout/sidebar";
import Info from "@/components/ui/infoIcone";
import ModosCores from "./components/modosCores";
import FaleConosco from "./components/faleConosco";
import InfoSite from "./components/infoSite";
import Button from "@/components/ui/button";

export default function Configuracoes() {
    return (
        <main>
            <div className="grid lg:grid-cols-[14rem_1fr] min-h-screen">
                <SideBar />

                <div className="min-w-0 p-8">
                    <div className="flex gap-2 items-center">
                        <h2 className="text-3xl font-bold">
                            Configurações
                        </h2>
                        <Info />
                    </div>

                    <p className="text-xl text-[var(--verde)] mb-6">
                        Adapte seu Equilibra como for confortável.
                    </p>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="min-w-0 flex flex-col gap-6">
                            <section>
                                <h2 className="text-2xl font-bold mb-3">
                                    Tema
                                </h2>
                                <ModosCores />
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-3">
                                    Fale Conosco
                                </h2>
                                <FaleConosco />
                            </section>
                            <Button texto="Salvar Configurações" tamanho="w-full py-5"/>
                        </div>
                        <aside className="min-w-0">
                            <h2 className="text-2xl font-bold mb-3">
                                Informações do Equilibra!
                            </h2>
                            <InfoSite />
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
}
