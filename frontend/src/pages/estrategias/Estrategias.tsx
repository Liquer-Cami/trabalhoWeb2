import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import LayoutPublico from "@/components/layout/layoutPublico";
import { listarEstrategias, type Categoria, type Estrategia } from "@/services/estrategias";

// LISTAGEM PÚBLICA 2: as estratégias de uma categoria (/estrategias/3)
export default function Estrategias() {
    const { categoriaId = "" } = useParams();
    const [categoria, setCategoria] = useState<Categoria>();
    const [estrategias, setEstrategias] = useState<Estrategia[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        listarEstrategias(categoriaId)
            .then(({ ok, dados }) => {
                if (ok && dados?.data) {
                    setCategoria(dados.data.categoria);
                    setEstrategias(dados.data.estrategias);
                } else {
                    setErro("Categoria não encontrada.");
                }
            })
            .catch(() => setErro("Não foi possível conectar ao servidor."));
    }, [categoriaId]);

    return (
        <LayoutPublico titulo={categoria?.nome ?? "Estratégias"} subtitulo={categoria?.descricao}>
            {erro && <p className="text-red-600">{erro}</p>}
            {!erro && categoria && estrategias.length === 0 && <p>Nenhuma estratégia nesta categoria ainda.</p>}

            {estrategias.map((e) => (
                <Link
                    key={e.id}
                    to={`/detalhe/estrategia/${e.id}`}
                    className="flex flex-col bg-[var(--creme-escuro)] hover:bg-[var(--hover-creme-escuro)] rounded-2xl p-6 text-lg gap-3"
                >
                    <h3 className="text-2xl font-bold">{e.titulo}</h3>
                    <p>{e.descricao_curta}</p>
                    <p>Dificuldade: <strong>{e.dificuldade}</strong> · {e.duracao_min} min</p>
                </Link>
            ))}
        </LayoutPublico>
    );
}
