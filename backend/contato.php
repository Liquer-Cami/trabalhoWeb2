<?php

require_once 'funcoes.php';

$dados = lerDados();
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$assunto = trim($dados['assunto'] ?? '');
$mensagem = trim($dados['mensagem'] ?? '');

//validacao backend
if (strlen($nome) < 2) {
    responder(400, ['status' => 'error', 'message' => 'Informe seu nome.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(400, ['status' => 'error', 'message' => 'Insira um e-mail válido.']);
}
if (strlen($assunto) < 3) {
    responder(400, ['status' => 'error', 'message' => 'Informe o assunto.']);
}
if (strlen($mensagem) < 10) {
    responder(400, ['status' => 'error', 'message' => 'A mensagem deve ter pelo menos 10 caracteres.']);
}

// guarda no banco
$insere = $pdo->prepare('INSERT INTO mensagens_contato (nome, email, assunto, mensagem) VALUES (?, ?, ?, ?)');
$insere->execute([$nome, $email, $assunto, $mensagem]);

// manda o e-mail. htmlspecialchars impede que o texto digitado vire HTML.
$corpo = '<p><strong>Nome:</strong> ' . htmlspecialchars($nome) . '</p>'
    . '<p><strong>E-mail:</strong> ' . htmlspecialchars($email) . '</p>'
    . '<p><strong>Mensagem:</strong><br>' . nl2br(htmlspecialchars($mensagem)) . '</p>';
$assunto = str_replace(["\r", "\n"], ' ', $assunto); 
enviarEmail(EMAIL_CONTATO, 'Fale conosco: ' . $assunto, $corpo);

responder(200, ['status' => 'success', 'message' => 'Mensagem enviada com sucesso! Responderemos em breve.']);
