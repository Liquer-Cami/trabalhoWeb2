import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { HomeIcon, ClipboardIcon, CalendarIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { API_URL, chamarApi, sair, lerUsuario, salvarUsuario, type Usuario } from "@/services/api";

const itensMenu = [
    { to: "/registroEmocional", texto: "Home", Icone: HomeIcon },
    { to: "/tarefas", texto: "Tarefas", Icone: ClipboardIcon },
    { to: "/historico", texto: "Histórico", Icone: CalendarIcon },
    { to: "/configuracoes", texto: "Configurações", Icone: Cog6ToothIcon },
];

export default function SideBar() {
    const { pathname } = useLocation();
    const [usuario, setUsuario] = useState<Usuario | null>(() => lerUsuario());

    // Sincroniza com os dados mais recentes do backend ao carregar a página
    useEffect(() => {
        chamarApi('GET', '/auth.php?acao=me')
            .then(({ ok, dados }) => {
                if (ok && dados?.usuario) {
                    setUsuario(dados.usuario);
                    salvarUsuario(dados.usuario);
                }
            })
            .catch(() => null);
    }, []);

    // Monta a URL completa da foto apontando para o backend
    const fotoUrl = usuario?.foto
        ? (usuario.foto.startsWith("http") ? usuario.foto : `${API_URL}/${usuario.foto}`)
        : null;

    const inicial = usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : "U";

    return (
        <aside className="bg-[var(--creme-escuro)] h-screen sticky top-0 flex flex-col shadow-md">
            {/* Topo: Logo */}
            <div className="flex items-center px-8 pt-8 pb-4">
                <h1 className="text-[var(--verde)] text-3xl font-bold">Equilibra</h1>
            </div>

            {/* Perfil: Nome do Usuário + Foto */}
            <div className="px-5 pb-6">
                <div className="flex items-center justify-between gap-3 p-3 bg-[var(--creme-claro)] rounded-2xl shadow-xs">
                    <span className="text-lg font-bold truncate" title={usuario?.nome ?? "Usuário"}>
                        {usuario?.nome ?? "Usuário"}
                    </span>

                    {fotoUrl ? (
                        <img
                            src={fotoUrl}
                            alt={usuario?.nome ?? "Foto do usuário"}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[var(--verde)] shrink-0"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--verde)] text-[var(--creme-claro)] flex items-center justify-center font-bold text-lg shrink-0">
                            {inicial}
                        </div>
                    )}
                </div>
            </div>

            {/* Navegação */}
            <nav className="flex flex-1 flex-col px-5 gap-2">
                {itensMenu.map(({ to, texto, Icone }) => (
                    <Link
                        key={to}
                        to={to}
                        className={`hover:bg-[var(--hover-creme-escuro)] rounded-lg flex gap-3 items-center justify-start px-2 py-3 ${pathname === to ? "bg-[var(--hover-creme-escuro)]" : ""}`}
                    >
                        <Icone className="w-6 h-6" />
                        <span className="text-lg">{texto}</span>
                    </Link>
                ))}
            </nav>

            {/* Botão Sair */}
            <div className="px-5 pb-6">
                <Link
                    to="/login"
                    onClick={() => { void sair(); setUsuario(null); }}
                    className="hover:bg-[var(--hover-creme-escuro)] rounded-lg flex gap-3 items-center justify-start px-2 py-3"
                >
                    <ArrowLeftStartOnRectangleIcon className="w-6 h-6" />
                    <span className="text-lg">Sair</span>
                </Link>
            </div>
        </aside>
    );
}
