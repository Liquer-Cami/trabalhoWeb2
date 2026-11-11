import Info from "@/components/ui/infoIcone";
import SideBar from "@/components/layout/sidebar";
import { useCallback, useEffect, useState } from "react";
import CalendarioHistorico from "./components/calendarioHistorico";
import CardResumo from "./components/cardResumo";
import { listarTarefas, tarefaOcorreNaData, type Tarefa } from "@/services/tarefas";
import { listarCheckins, type Checkin } from "@/services/checkin";

function formatarData(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function diaDoCheckin(checkin: Checkin) {
    return checkin.data.slice(0, 10);
}

function nomeHumor(humor: string) {
    const nomes: Record<string, string> = {
        "muito-bem": "Muito bem",
        bem: "Bem",
        neutro: "Neutro",
        mal: "Mal",
        "muito-mal": "Muito mal",
    };
    return nomes[humor] ?? humor;
}

export default function Historico() {
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [erro, setErro] = useState("");

    const buscarHistorico = useCallback(async () => {
        const [respostaTarefas, respostaCheckins] = await Promise.all([
            listarTarefas(),
            listarCheckins(),
        ]);
        if (
            !respostaTarefas.ok
            || respostaTarefas.dados?.status !== "success"
            || !Array.isArray(respostaTarefas.dados.data)
        ) {
            throw new Error(respostaTarefas.dados?.message ?? "Não foi possível carregar as tarefas.");
        }
        if (
            !respostaCheckins.ok
            || respostaCheckins.dados?.status !== "success"
            || !Array.isArray(respostaCheckins.dados.data)
        ) {
            throw new Error(respostaCheckins.dados?.message ?? "Não foi possível carregar os check-ins.");
        }
        return {
            tarefas: respostaTarefas.dados.data,
            checkins: respostaCheckins.dados.data,
        };
    }, []);

    useEffect(() => {
        let ativa = true;
        buscarHistorico()
            .then(({ tarefas: tarefasCarregadas, checkins: checkinsCarregados }) => {
                if (!ativa) return;
                setTarefas(tarefasCarregadas);
                setCheckins(checkinsCarregados);
                setErro("");
            })
            .catch(() => {
                if (ativa) {
                    setErro("Não foi possível carregar o histórico. Verifique a conexão com o servidor.");
                }
            });
        return () => {
            ativa = false;
        };
    }, [buscarHistorico]);

    const ano = dataSelecionada.getFullYear();
    const mes = dataSelecionada.getMonth();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const datasDoMes = Array.from({ length: diasNoMes }, (_, indice) =>
        formatarData(new Date(ano, mes, indice + 1))
    );
    const tarefasDoMes = tarefas.flatMap((tarefa) =>
        datasDoMes
            .filter((data) => tarefaOcorreNaData(tarefa, data))
            .map((data) => ({
                data,
                concluida: tarefa.recorrencia
                    ? (tarefa.ocorrencias_concluidas ?? []).includes(data)
                        || (data === tarefa.data && tarefa.status === "Concluída")
                    : tarefa.status === "Concluída",
            }))
    );
    const tarefasConcluidas = tarefasDoMes.filter((tarefa) => tarefa.concluida).length;
    const tarefasPendentes = tarefasDoMes.length - tarefasConcluidas;
    const hoje = formatarData(new Date());
    const tarefasAtrasadas = tarefasDoMes.filter((tarefa) =>
        !tarefa.concluida && tarefa.data < hoje
    ).length;
    const checkinsDoMes = checkins.filter((checkin) => {
        const data = diaDoCheckin(checkin);
        return data.startsWith(`${ano}-${String(mes + 1).padStart(2, "0")}-`);
    });

    const humorContagem = new Map<string, number>();
    const fatorContagem = new Map<string, number>();
    for (const checkin of checkinsDoMes) {
        humorContagem.set(checkin.humor, (humorContagem.get(checkin.humor) ?? 0) + 1);
        for (const fator of checkin.fatores) {
            fatorContagem.set(fator, (fatorContagem.get(fator) ?? 0) + 1);
        }
    }
    const humorFrequente = [...humorContagem.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const fatorFrequente = [...fatorContagem.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

    return (
        <main>
            <div className="grid lg:grid-cols-[14rem_1fr_25rem] min-h-screen">
                <SideBar />
                <div className="min-w-0 p-8 flex flex-col gap-4 overflow-y-auto">
                    <div>
                        <div className="flex gap-2 items-center">
                            <h2 className="text-3xl font-bold">Histórico</h2>
                            <Info />
                        </div>
                        <p className="text-xl text-[var(--verde)]">Revise seus registros e perceba seus padrões ao longo do tempo.</p>
                    </div>
                    {erro && <p role="alert" className="text-red-700">{erro}</p>}
                    <CalendarioHistorico
                        dataSelecionada={dataSelecionada}
                        setDataSelecionada={setDataSelecionada}
                        tarefas={tarefas}
                        checkins={checkins}
                    />
                    <div className="flex justify-between text-lg">
                        <div className="flex gap-2">
                            <p>Registro de Tarefas:</p>
                            <p className="text-green-500">Verde</p>
                        </div>
                        <div className="flex gap-2">
                            <p>Registro de Check-in Emocional:</p>
                            <p className="text-blue-500">Azul</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-5 p-10 bg-[var(--creme-escuro)]">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <h2 className="text-2xl font-bold">Resumo de</h2>
                                <h2 className="text-2xl font-bold">{dataSelecionada.toLocaleDateString("pt-BR", { month: "long" })}</h2>
                            </div>
                            <p className="text-xl">Visão geral do mês:</p>
                        </div>
                        <div className="flex flex-col gap-5">
                            <CardResumo
                                titulo="Tarefas:"
                                valor={
                                    <>
                                        <p>Concluídas: <strong>{tarefasConcluidas}</strong></p>
                                        <p>Pendentes: <strong>{tarefasPendentes}</strong></p>
                                        <p>Atrasadas: <strong>{tarefasAtrasadas}</strong></p>
                                    </>
                                }
                                cor="border-3 border-green-500"
                            />
                        </div>
                        <div className="flex flex-col gap-5">
                            <CardResumo
                                titulo="Emoções:"
                                valor={
                                    <>
                                        <p>Registros: <strong>{checkinsDoMes.length}</strong></p>
                                        <p>Humor frequente: <strong>{humorFrequente ? nomeHumor(humorFrequente) : "Sem registros"}</strong></p>
                                        <p>Fator frequente: <strong>{fatorFrequente ?? "Sem registros"}</strong></p>
                                    </>
                                }
                                cor="border-3 border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
