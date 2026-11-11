import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import LayoutPublico from "@/components/layout/layoutPublico";
import { buscarDetalhe, type Categoria, type Estrategia } from "@/services/estrategias";

export default function Detalhe() {
    const { tipo = "", id = "" } = useParams();
    const [item, setItem] = useState<Estrategia & Categoria>();
    const [erro, setErro] = useState("");

    useEffect(() => {
        buscarDetalhe(tipo, id)
            .then(({ ok, dados }) => {
                if (ok && dados?.data) setItem(dados.data);
                else setErro("Item não encontrado.");
            })
            .catch(() => setErro("Não foi possível conectar ao servidor."));
    }, [tipo, id]);

    const titulo = tipo === "estrategia" ? item?.titulo : item?.nome;

    return (
        <LayoutPublico titulo={titulo ?? "Detalhe"}>
            {erro && <p className="text-red-600">{erro}</p>}

            {item && tipo === "estrategia" && (
                <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl p-6 text-lg gap-3">
                    <p>{item.descricao_curta}</p>
                    <p>Dificuldade: <strong>{item.dificuldade}</strong></p>
                    <p>Duração: <strong>{item.duracao_min} min</strong></p>
                </div>
            )}

            {item && tipo === "estrategia" && item.como_fazer && (
                <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl p-6 text-lg gap-3">
                    <h3 className="text-2xl font-bold">Como fazer</h3>
                    <p className="whitespace-pre-line">{item.como_fazer}</p>
                </div>
            )}

            {item && tipo === "categoria" && (
                <div className="flex flex-col bg-[var(--creme-escuro)] rounded-2xl p-6 text-lg gap-3">
                    <p>{item.descricao}</p>
                    <Link to={`/estrategias/${item.id}`} className="text-[var(--verde)] font-bold underline hover:opacity-80">
                        Ver as estratégias →
                    </Link>
                </div>
            )}
        </LayoutPublico>
    );
}
