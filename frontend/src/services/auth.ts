import * as z from 'zod'
import {
  CadastroSchema,
  RedefinirSenha,
  type FormState,
} from '@/lib/definitions'
import { MENSAGEM_ERRO_CONEXAO, chamarApi, enviarFormulario, salvarUsuario } from './api'

export async function login(formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim()
  const senha = String(formData.get('senha') ?? '')

  if (!email || !senha) {
    return { message: 'Preencha o e-mail e a senha.' }
  }

  try {
    const { ok, dados } = await chamarApi('POST', '/auth.php?acao=login', { email, senha })

    if (!ok) {
      return { message: dados?.message ?? 'E-mail ou senha inválidos.' }
    }

    if (dados?.usuario) {
      salvarUsuario(dados.usuario)
    }
  } catch {
    return { message: MENSAGEM_ERRO_CONEXAO }
  }

  return { sucesso: true }
}

export async function cadastro(formData: FormData): Promise<FormState> {
  const nome = String(formData.get('nome') ?? '')
  const email = String(formData.get('email') ?? '').trim()
  const senha = String(formData.get('senha') ?? '')
  const confirmaSenha = String(formData.get('confirmaSenha') ?? '')

  if (!nome || !email || !senha || !confirmaSenha) {
    return { message: 'Preencha todos os campos.' }
  }

  if (confirmaSenha !== senha) {
    return { message: 'As senhas devem ser iguais!' }
  }

  const validacao = CadastroSchema.safeParse({ nome, email, senha })

  if (!validacao.success) {
    return { errors: z.flattenError(validacao.error).fieldErrors }
  }

  try {
    const { ok, dados } = await enviarFormulario('/auth.php?acao=cadastro', formData)

    if (!ok) {
      return {
        message:
          dados?.message ??
          'Esse email já possui uma conta, clique em cadastrar!',
      }
    }

    if (dados?.usuario) {
      salvarUsuario(dados.usuario)
    }
  } catch {
    return { message: MENSAGEM_ERRO_CONEXAO }
  }

  return { sucesso: true }
}

export async function emailRecuperacao(formData: FormData): Promise<FormState & { link?: string }> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    return { message: 'Preencha o email.' }
  }

  try {
    const { ok, dados } = await chamarApi('POST', '/auth.php?acao=esqueci_senha', { email })

    if (!ok) {
      return {
        message: dados?.message ?? 'Não foi possível enviar o email de recuperação.',
      }
    }

    return {
      sucesso: true,
      message: dados?.message,
    }
  } catch {
    return { message: MENSAGEM_ERRO_CONEXAO }
  }
}

export async function redefinirSenha(formData: FormData): Promise<FormState> {
  const senha = String(formData.get('senha') ?? '')
  const confirmaSenha = String(formData.get('confirmaSenha') ?? '')
  const token = String(formData.get('token') ?? '')

  if (!senha || !confirmaSenha) {
    return { message: 'Preencha todos os campos.' }
  }

  if (confirmaSenha !== senha) {
    return { message: 'As senhas devem ser iguais!' }
  }

  const validacao = RedefinirSenha.safeParse({ senha })

  if (!validacao.success) {
    return { errors: z.flattenError(validacao.error).fieldErrors }
  }

  try {
    const { ok, dados } = await chamarApi('POST', '/auth.php?acao=redefinir_senha', {
      token,
      novaSenha: validacao.data.senha,
    })

    if (!ok) {
      return { message: dados?.message ?? 'Token inválido ou expirado!' }
    }
  } catch {
    return { message: MENSAGEM_ERRO_CONEXAO }
  }

  return { sucesso: true }
}