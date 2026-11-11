import { useCallback, useEffect, useState } from "react";
import CardTarefa from "./components/cardTarefa";
import InfoCard from "@/components/ui/infoCard";
import SideBar from "@/components/layout/sidebar";
import FormTarefa from "./components/formTarefa";
import CalendarioTarefa from "./components/calendarioTarefa";
import { listarTarefas, type Tarefa as TarefaType } from "@/services/tarefas";
import SugestoesTarefas from "./components/sugestoesTarefas";



export default function Tarefas() {
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [tarefas, setTarefas] = useState<TarefaType[]>([]);
    const [erro, setErro] = useState("");

    const buscarTarefas = useCallback(async () => {
        const { ok, dados } = await listarTarefas();
        if (!ok || dados?.status !== "success" || !Array.isArray(dados.data)) {
            throw new Error(dados?.message ?? "Não foi possível carregar as tarefas.");
        }
        return dados.data;
    }, []);

    const carregarTarefas = useCallback(async () => {
        try {
            setTarefas(await buscarTarefas());
            setErro("");
        } catch {
            setErro("Não foi possível conectar ao servidor. Verifique o Apache do XAMPP.");
        }
    }, [buscarTarefas]);

    useEffect(() => {
        let ativa = true;
        buscarTarefas()
            .then((dados) => {
                if (ativa) setTarefas(dados);
            })
            .catch(() => {
                if (ativa) setErro("Não foi possível carregar as tarefas. Verifique o Apache do XAMPP.");
            });
        return () => {
            ativa = false;
        };
    }, [buscarTarefas]);

    return (
        <main>
        <div className="grid grid-cols-[14rem_1fr] min-h-screen">
            <SideBar />
            <div>
                <div className="p-8">
                    <div className="flex justify-between items-center bg-[var(--creme-escuro)] p-5 rounded-2xl">
                        <div>
                            <div className="flex gap-2 items-center">
                                <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
                            </div>
                            <h2 className="text-xl text-[var(--verde)]">Gerencie suas tarefas respeitando seu limite.</h2>
                        </div>
                        <FormTarefa onCriada={carregarTarefas} />
                    </div>
                    <div className="flex items-center justify-between p-5">
                        <h2 className="text-xl font-bold">{dataSelecionada.toLocaleDateString("pt-BR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}</h2>
                    </div>
                    <div className=" flex gap-6 justify-between">
                        <div className="w-full flex flex-col gap-5">
                            {erro && <p role="alert" className="mb-4 text-red-700">{erro}</p>}
                            <CardTarefa
                                dataSelecionada={dataSelecionada}
                                tarefas={tarefas}
                                onAlterada={carregarTarefas}
                            />
                             <SugestoesTarefas/>
                        </div>
                        <div className="flex flex-col gap-5 items-center bg-[var(--creme-escuro)] p-6 rounded-2xl">
                            <CalendarioTarefa
                                dataSelecionada={dataSelecionada}
                                setDataSelecionada={setDataSelecionada}
                            />
                            <InfoCard titulo="Qual a prioridade da minha tarefa?"
                                texto={<div className="flex flex-col items-center">
                                    <p className="text-red-500 text-xl">
                                        Vermelho - Alta
                                    </p>
                                    <p className="text-yellow-500 text-xl">
                                        Amarelo - Média
                                    </p>
                                    <p className="text-green-500 text-xl">
                                        Verde - Baixa
                                    </p>
                                </div>}
                                imagem="/lampada.svg" info_imagem={"info"} largura_imagem={0} altura_imagem={0} tamanho="p-7" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </main>
    )
} 