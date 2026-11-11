import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import Login from '@/pages/login/Login'
import Cadastro from '@/pages/cadastro/Cadastro'
import ConfirmacaoCadastro from '@/pages/confirmacaoCadastro/ConfirmacaoCadastro'
import EmailRecuperacao from '@/pages/emailRecuperacao/EmailRecuperacao'
import RedefinirSenha from '@/pages/redefinirSenha/RedefinirSenha'
import RegistroEmocional from '@/pages/registroEmocional/RegistroEmocional'
import Tarefas from '@/pages/tarefas/Tarefas'
import Historico from '@/pages/historico/Historico'
import Configuracoes from '@/pages/configuracoes/Configuracoes'
import FaleConosco from '@/pages/faleConosco/FaleConosco'
import Termos from '@/pages/termos/Termos'
import NaoEncontrada from '@/pages/NaoEncontrada'
import RotaProtegida from '@/components/providers/rotaProtegida'
import Categorias from '@/pages/estrategias/Categorias'
import Estrategias from '@/pages/estrategias/Estrategias'
import Detalhe from '@/pages/estrategias/Detalhe'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    // meta plagiarism
    let metaPlagio = document.querySelector('meta[name="plagiarism"]')
    if (!metaPlagio) {
      metaPlagio = document.createElement('meta')
      metaPlagio.setAttribute('name', 'plagiarism')
      document.head.appendChild(metaPlagio)
    }
    metaPlagio.setAttribute(
      'content',
      'Trabalho original desenvolvido por Camila Liquer Pinto para a plataforma Equilibra. Declaro que este projeto é de minha autoria e não contém plágio.'
    )
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/confirmacaoCadastro" element={<ConfirmacaoCadastro />} />
      <Route path="/emailRecuperacao" element={<EmailRecuperacao />} />
      <Route path="/redefinirSenha" element={<RedefinirSenha />} />
      <Route path="/registroEmocional" element={<RotaProtegida><RegistroEmocional /></RotaProtegida>} />
      <Route path="/tarefas" element={<RotaProtegida><Tarefas /></RotaProtegida>} />
      <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
      <Route path="/configuracoes" element={<RotaProtegida><Configuracoes /></RotaProtegida>} />
      <Route path="/faleConosco" element={<FaleConosco />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/estrategias" element={<Categorias />} />
      <Route path="/estrategias/:categoriaId" element={<Estrategias />} />
      <Route path="/detalhe/:tipo/:id" element={<Detalhe />} />
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  )
}
