import { useState, type FormEvent } from 'react'
import type { FormState } from '@/lib/definitions'

export function useEnvioForm(
  acao: (formData: FormData) => Promise<FormState>,
  aoSucesso: () => void,
) {
  const [state, setState] = useState<FormState>(undefined)
  const [pending, setPending] = useState(false)

  async function onSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    setPending(true)
    setState(undefined)

    const resultado = await acao(new FormData(evento.currentTarget))

    setPending(false)

    if (resultado?.sucesso) {
      aoSucesso()
      return
    }

    setState(resultado)
  }

  return { state, pending, onSubmit }
}
