import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router'
import { chamarApi } from '@/services/api'

// Confere no backend se a sessão ainda existe antes de mostrar uma página privada.
export default function RotaProtegida({ children }: { children: ReactNode }) {
  const [verificando, setVerificando] = useState(true)
  const [autorizado, setAutorizado] = useState(false)

  useEffect(() => {
    chamarApi('GET', '/auth.php?acao=me')
      .then(({ ok }) => setAutorizado(ok))
      .catch(() => setAutorizado(false))
      .finally(() => setVerificando(false))
  }, [])

  if (verificando) {
    return <main className="min-h-screen flex items-center justify-center">Verificando sessão...</main>
  }
  if (!autorizado) return <Navigate to="/login" replace />
  return <>{children}</>
}