<?php
// =====================================================================
// MODELO DE CONFIGURAÇÃO
// Copie este arquivo com o nome "config.php" e preencha com os seus dados.
// O config.php NÃO vai para o GitHub (está no .gitignore) porque
// guarda a senha do banco e a chave do Gemini.
// =====================================================================

// Fuso horário usado nos logs e nas datas
date_default_timezone_set('America/Sao_Paulo');

// ---- Banco de dados (no XAMPP: usuário root e senha vazia) ----
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NOME', 'equilibra');
define('DB_USUARIO', 'root');
define('DB_SENHA', '');

// ---- Gemini (chave grátis em https://aistudio.google.com/apikey) ----
define('GEMINI_CHAVE', 'COLOQUE_SUA_CHAVE_AQUI');
// Nome do modelo. Se der erro 404, confira o nome atual no AI Studio.
define('GEMINI_MODELO', 'gemini-3.5-flash');

// ---- E-mail (função mail() do PHP) ----
define('EMAIL_REMETENTE', 'contato@seudominio.com.br'); // "From" dos e-mails
define('EMAIL_CONTATO', 'contato@seudominio.com.br');   // recebe o Fale Conosco

// ---- Endereço do React (link de recuperação de senha e CORS) ----
define('URL_FRONTEND', 'http://localhost:5173');

// ---- Modo desenvolvimento ----
// true  = grava o conteúdo dos e-mails em logs/emails.log (útil no XAMPP,
//         onde o mail() normalmente não envia nada de verdade).
// false = use na hospedagem.
define('MODO_DEV', true);
