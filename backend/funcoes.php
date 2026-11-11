<?php
// Conecta no banco, libera o React a chamar a API, inicia a sessão
// e guarda as funções que vários arquivos usam.

require_once 'conexao.php';

ini_set('display_errors', '0');

// A resposta é sempre JSON
header('Content-Type: application/json; charset=utf-8');

// CORS: o React roda em outro endereço (porta 5173), então liberamos ele aqui
header('Access-Control-Allow-Origin: ' . URL_FRONTEND);
header('Access-Control-Allow-Credentials: true'); // deixa o React mandar o cookie da sessão
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Antes de alguns pedidos o navegador manda um OPTIONS perguntando "posso?". Só respondemos que sim.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Sessão com cookie mais seguro
session_set_cookie_params([
    'lifetime' => 0,     
    'path'     => '/',
    'httponly' => true,   
    'samesite' => 'Lax',   
]);
session_start();

// Manda a resposta em JSON e para o script
function responder($codigo, $dados)
{
    http_response_code($codigo);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

// Lê os dados que o React mandou.
// Formulário com foto vem no $_POST; o resto vem em JSON no corpo da requisição.
function lerDados()
{
    if (!empty($_POST)) {
        return $_POST;
    }
    $dados = json_decode(file_get_contents('php://input'), true);
    if (is_array($dados)) {
        return $dados;
    }
    return [];
}

// Para as páginas que precisam de login.
// Devolve o id do usuário logado.
function exigirLogin()
{
    if (!isset($_SESSION['usuario_id'])) {
        responder(401, ['status' => 'error', 'message' => 'Faça login para continuar.']);
    }
    return $_SESSION['usuario_id'];
}

// Senha forte: 8 ou mais caracteres, com letra, número e símbolo
function senhaForte($senha)
{
    return strlen($senha) >= 8
        && preg_match('/[a-zA-Z]/', $senha)
        && preg_match('/[0-9]/', $senha)
        && preg_match('/[^a-zA-Z0-9]/', $senha);
}

// Log: escreve uma linha em logs/auth.log (data, evento, usuário, IP e navegador).
function gravarLog($evento, $usuarioId = '-')
{
    $linha = date('c') . ' | ' . $evento
        . ' | usuario=' . $usuarioId
        . ' | ip=' . $_SERVER['REMOTE_ADDR']
        . ' | navegador=' . ($_SERVER['HTTP_USER_AGENT'] ?? '');
    file_put_contents(__DIR__ . '/logs/auth.log', $linha . PHP_EOL, FILE_APPEND);
}

// envia e-mail com a função mail() do PHP
function enviarEmail($para, $assunto, $mensagem)
{
    $cabecalhos = "MIME-Version: 1.0\r\n";
    $cabecalhos .= "Content-Type: text/html; charset=UTF-8\r\n";
    $cabecalhos .= 'From: Equilibra <' . EMAIL_REMETENTE . ">\r\n";

    // O @ esconde o aviso quando o mail() falha (no XAMPP ele normalmente não envia)
    $enviou = @mail($para, $assunto, $mensagem, $cabecalhos);

    // No XAMPP o e-mail não chega, então em modo de teste guardamos ele no log
    if (MODO_DEV) {
        $linha = date('c') . ' | para=' . $para . ' | ' . $assunto . ' | ' . strip_tags($mensagem, '<a>');
        file_put_contents(__DIR__ . '/logs/emails.log', $linha . PHP_EOL, FILE_APPEND);
    }
    return $enviou;
}
