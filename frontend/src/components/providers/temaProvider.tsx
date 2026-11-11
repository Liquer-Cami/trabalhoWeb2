import { useEffect, useState, type ReactNode } from 'react'
import { TEMA_STORAGE_KEY, TemaContext, type Tema } from '@/contexts/temaContext'

function lerTemaSalvo(): Tema {
  try {
    return localStorage.getItem(TEMA_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export default function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(lerTemaSalvo)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark')

    try {
      localStorage.setItem(TEMA_STORAGE_KEY, tema)
    } catch {
      // localStorage indisponível (modo privado, etc.): o tema só vale nesta sessão
    }
  }, [tema])

  return (
    <TemaContext.Provider value={{ tema, setTema }}>
      {children}
    </TemaContext.Provider>
  )
}
