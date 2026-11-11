import { createContext } from 'react'

export type Tema = 'light' | 'dark'

export interface TemaContextValue {
  tema: Tema
  setTema: (tema: Tema) => void
}

export const TEMA_STORAGE_KEY = 'equilibra-tema'

export const TemaContext = createContext<TemaContextValue | null>(null)
