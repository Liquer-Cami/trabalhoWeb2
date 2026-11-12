<?php

// MODELO DE CONFIGURAÇÃO
// Copie este arquivo com o nome "config.php" e preencha com os seus dados.
// O config.php NÃO vai para o GitHub (está no .gitignore) porque
// guarda a senha do banco e a chave do Gemini.

date_default_timezone_set('America/Sao_Paulo');

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NOME', 'equilibra');
define('DB_USUARIO', 'root');
define('DB_SENHA', '');

define('GEMINI_CHAVE', 'COLOQUE_SUA_CHAVE_AQUI');
define('GEMINI_MODELO', 'gemini-3.5-flash');


define('EMAIL_USUARIO', 'suaconta@gmail.com'); 
define('EMAIL_SENHA', 'COLOQUE_A_SENHA_DE_APP'); 
define('EMAIL_CONTATO', 'suaconta@gmail.com');  

define('URL_FRONTEND', 'http://localhost:5173');
