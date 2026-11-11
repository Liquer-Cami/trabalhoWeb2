import * as z from 'zod'

const senhaSchema = z
  .string()
  .min(8, { error: 'Insira pelo menos 8 caracteres.' })
  .regex(/[a-zA-Z]/, { error: 'Precisa conter pelo menos 1 letra.' })
  .regex(/[0-9]/, { error: 'Precisa conter pelo menos 1 número.' })
  .regex(/[^a-zA-Z0-9]/, {
    error: 'Precisa conter pelo menos 1 caractere especial.',
  })
  .trim()

export const CadastroSchema = z.object({
  nome: z
    .string()
    .min(2, { error: 'Insira pelo menos 2 caracteres.' })
    .trim(),
  email: z.email({ error: 'Insira um email válido.' }).trim(),
  senha: senhaSchema,
})

export const RedefinirSenha = z.object({
  senha: senhaSchema,
})

export type FormState =
  | {
      errors?: {
        nome?: string[]
        email?: string[]
        senha?: string[]
      }
      message?: string
      sucesso?: boolean
    }
  | undefined
