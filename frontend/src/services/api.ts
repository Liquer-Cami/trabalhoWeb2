export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/Equilibra%20Web%202/backend'

export const MENSAGEM_ERRO_CONEXAO = 'Não foi possível conectar ao servidor. Tente novamente.'

export interface Usuario {
  id: number
  nome: string
  email: string
  foto?: string | null
}

//sempre um JSON com status, message e/ou data
export interface RespostaApi<T> {
  ok: boolean 
  dados: {
    status?: string
    message?: string
    data?: T
    usuario?: Usuario
  } | null
}

// Chama um arquivo PHP e devolve a resposta.
export async function chamarApi<T = unknown>(metodo: string, caminho: string, corpo?: unknown): Promise<RespostaApi<T>> {
  const resposta = await fetch(API_URL + caminho, {
    method: metodo,
    credentials: 'include', // manda o cookie da sessão 
    headers: { 'Content-Type': 'application/json' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })
  const dados = await resposta.json().catch(() => null)
  return { ok: resposta.ok, dados }
}

// Cadastro com foto: vai como formulário (FormData), não como JSON
export async function enviarFormulario<T = unknown>(caminho: string, formData: FormData): Promise<RespostaApi<T>> {
  const resposta = await fetch(API_URL + caminho, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  const dados = await resposta.json().catch(() => null)
  return { ok: resposta.ok, dados }
}

// O navegador guarda só o nome e a foto para mostrar na tela.


export function salvarUsuario(usuario: Usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario))
}

export function lerUsuario(): Usuario | null {
  const dados = localStorage.getItem('usuario')
  if (!dados) return null
  try {
    return JSON.parse(dados)
  } catch {
    return null
  }
}

export function estaLogado() {
  return lerUsuario() !== null
}

export async function sair() {
  try {
    await chamarApi('POST', '/auth.php?acao=logout')
  } finally {
    localStorage.removeItem('usuario')
  }
}
