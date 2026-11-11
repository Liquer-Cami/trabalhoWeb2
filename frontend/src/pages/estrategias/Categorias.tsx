import { useEffect, useState } from "react";
import { Link } from "react-router";
import LayoutPublico from "@/components/layout/layoutPublico";
import { listarCategorias, type Categoria } from "@/services/estrategias";

export default function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        listarCategorias()
            .then(({ ok, dados }) => {
                if (ok && dados?.data) setCategorias(dados.data);
                else setErro("Não foi possível carregar as categorias.");
            })
            .catch(() => setErro("Não foi possível conectar ao servidor."));
    }, []);

    return (
        <LayoutPublico titulo="Estratégias de autorregulação" subtitulo="Escolha o tipo de ajuda que você precisa agora.">
            {erro && <p className="text-red-600">{erro}</p>}

            {categorias.map((c) => (
                <Link
                    key={c.id}
                    to={`/estrategias/${c.id}`}
                    className="flex flex-col bg-[var(--creme-escuro)] hover:bg-[var(--hover-creme-escuro)] rounded-2xl p-6 text-lg gap-3"
                >
                    <h3 className="text-2xl font-bold">{c.nome}</h3>
                    <p>{c.descricao}</p>
                    <p className="text-[var(--verde)]">{c.total} estratégia(s)</p>
                </Link>
            ))}
        </LayoutPublico>
    );
}
