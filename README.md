# Equilibra

Apoio à rotina para pessoas neurodivergentes: check-in emocional, tarefas, estratégias de autorregulação e recomendação de tarefas por IA (Gemini).

- **Front-end:** React + TypeScript (SPA), pasta `frontend/`
- **Back-end:** PHP puro, sem frameworks, + MySQL com PDO, pasta `backend/`

## Como rodar (XAMPP)

1. Ligue o Apache e o MySQL.
2. No phpMyAdmin, importe `database/schema.sql`.
3. Copie `backend/config.exemplo.php` para `backend/config.php` e preencha (banco, chave do Gemini).
4. Em `frontend/.env.local`: `VITE_API_URL=http://localhost/Equilibra%20Web%202/backend`
5. `cd frontend && npm install && npm run dev` e abra http://localhost:5173

## Front e back separados

- **`frontend/`** tem todas as telas (React). Ele só conversa com o backend pedindo e recebendo JSON.
- **`backend/`** só tem PHP que responde JSON. Nenhuma tela fica no backend.

Telas públicas (sem login), no mesmo estilo da tela de Termos:
`/estrategias` (categorias) → `/estrategias/:id` (estratégias da categoria) → `/detalhe/estrategia/:id`.
Quem está logado acessa por Configurações; quem não está, pelo link no login.

## Arquivos PHP do backend (11)

Cada arquivo é lido de cima para baixo: um `if` vê o método (GET, POST, PUT...) ou a `?acao=` da URL e faz aquela parte.

| Arquivo | O que faz |
|---|---|
| `config.php` | Senha do banco e chave do Gemini (não vai para o GitHub) |
| `conexao.php` | Conecta no MySQL (PDO) |
| `funcoes.php` | Começo da API: CORS, sessão, `responder()`, `exigirLogin()`, log e e-mail (PHPMailer + Gmail) |
| `auth.php` | `?acao=` login, cadastro (com foto em `uploads/`), me, logout, esqueci_senha, redefinir_senha |
| `tarefas.php` | Tarefas: GET lista, POST cria, PUT edita, PATCH conclui, DELETE apaga |
| `checkin.php` | Check-in emocional: GET lista, POST salva |
| `sugestoes.php` | Gemini recomenda as tarefas já cadastradas conforme o humor |
| `contato.php` | Fale Conosco (salva no banco e envia o e-mail) |
| `categorias.php`, `estrategias.php` | As duas listagens públicas (JSON) |
| `detalhe.php` | Detalhe de 1 estratégia ou categoria (um PHP para os dois) |

## Segurança e logs

- `session_regenerate_id(true)` logo após o login e o cadastro (evita session fixation).
- Cookie da sessão com `httponly` e `samesite`.
- Senhas salvas com `password_hash` e conferidas com `password_verify`.
- Todo SQL usa `prepare` com `?` (evita SQL injection).
- Logs em `backend/logs/auth.log`: data, evento (LOGIN, LOGIN_FALHOU, LOGOUT, CADASTRO...), usuário, IP e navegador. Senha e token nunca são gravados.
