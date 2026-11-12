<?php

require_once 'conexao.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');

header('Access-Control-Allow-Origin: ' . URL_FRONTEND);
header('Access-Control-Allow-Credentials: true'); // deixa o React mandar o cookie da sessão
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

function gravarLog($evento, $usuarioId = '-')
{
    $linha = date('c') . ' | ' . $evento
        . ' | usuario=' . $usuarioId
        . ' | ip=' . $_SERVER['REMOTE_ADDR']
        . ' | navegador=' . ($_SERVER['HTTP_USER_AGENT'] ?? '');
    file_put_contents(__DIR__ . '/logs/auth.log', $linha . PHP_EOL, FILE_APPEND);
}

function enviarEmail($para, $assunto, $mensagem)
{
    $mail = new PHPMailer(true);

    try {
        // Configurações do servidor
        $mail->isSMTP();          // Define o uso de SMTP no envio
        $mail->SMTPAuth = true;   // Habilita a autenticação SMTP

        $mail->Username = EMAIL_USUARIO;  // conta do Gmail
        $mail->Password = EMAIL_SENHA;    // senha de app do Google (não é a senha normal)

        // Criptografia do envio
        $mail->SMTPSecure = 'tls';

        // Informações especificadas pelo Google
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;

        $mail->CharSet = 'UTF-8'; // para os acentos aparecerem certo

        // Remetente e destinatário
        $mail->setFrom(EMAIL_USUARIO, 'Equilibra');
        $mail->addAddress($para);

        // Conteúdo da mensagem
        $mail->isHTML(true);
        $mail->Subject = $assunto;
        $mail->Body = $mensagem;

        $mail->send();
        return true;
    } catch (Exception $e) {
        gravarLog('EMAIL_FALHOU: ' . $mail->ErrorInfo);
        return false;
    }
}
.
gravarLog($_SERVER['REQUEST_METHOD'] . ' ' . basename($_SERVER['REQUEST_URI']), $_SESSION['usuario_id'] ?? '-');
