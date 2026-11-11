import { useContext } from 'react'
import { TemaContext } from '@/contexts/temaContext'

export function useTema() {
  const contexto = useContext(TemaContext)

  if (!contexto) {
    throw new Error('useTema deve ser usado dentro de <TemaProvider>.')
  }

  return contexto
}
