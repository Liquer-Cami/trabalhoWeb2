<?php

require_once 'funcoes.php';

$acao = $_GET['acao'] ?? '';
$dados = lerDados();

$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

//LOGIN
if ($acao === 'login') {
    $consulta = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
    $consulta->execute([$email]);
    $usuario = $consulta->fetch();

    // vai comparar a senha digitada com o hash salvo no banco
    if (!$usuario || !password_verify($senha, $usuario['senha'])) {
        gravarLog('LOGIN_FALHOU');
        responder(401, ['status' => 'error', 'message' => 'E-mail ou senha incorretos.']);
    }

    session_regenerate_id(true); // vai trocar o id das sessoes
    $_SESSION['usuario_id'] = $usuario['id'];
    gravarLog('LOGIN', $usuario['id']);

    responder(200, [
        'status'  => 'success',
        'message' => 'Login realizado com sucesso!',
        'usuario' => [
            'id'    => (int) $usuario['id'],
            'nome'  => $usuario['nome'],
            'email' => $usuario['email'],
            'foto'  => $usuario['foto'],
        ],
    ]);
}

// CADASTRO
if ($acao === 'cadastro') {
    $nome = trim($dados['nome'] ?? '');

    // Validação no backend
    if (strlen($nome) < 2 || strlen($nome) > 100) {
        responder(400, ['status' => 'error', 'message' => 'O nome deve ter entre 2 e 100 caracteres.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        responder(400, ['status' => 'error', 'message' => 'Insira um e-mail válido.']);
    }
    if (!senhaForte($senha)) {
        responder(400, ['status' => 'error', 'message' => 'A senha precisa de 8+ caracteres, com letra, número e símbolo.']);
    }

    //Aqui vai verificar se esse email ja pertence a uma conta
    $consulta = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
    $consulta->execute([$email]);
    if ($consulta->fetch()) {
        responder(409, ['status' => 'error', 'message' => 'Este e-mail já está cadastrado.']);
    }

    // Foto salva o arquivo opcional
    $foto = null;
    if (!empty($_FILES['foto']['name'])) {
        $arquivo = $_FILES['foto'];

        $imagem = getimagesize($arquivo['tmp_name']);
        $tipos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

        if (!$imagem || !isset($tipos[$imagem['mime']]) || $arquivo['size'] > 2 * 1024 * 1024) {
            responder(400, ['status' => 'error', 'message' => 'Envie uma foto JPG, PNG ou WEBP de até 2 MB.']);
        }

        // deixa o nome do arquivo unico
        $foto = 'uploads/' . uniqid() . '.' . $tipos[$imagem['mime']];
        move_uploaded_file($arquivo['tmp_name'], __DIR__ . '/' . $foto);
    }

    // salva a senha em hash
    $insere = $pdo->prepare('INSERT INTO usuarios (nome, email, senha, foto) VALUES (?, ?, ?, ?)');
    $insere->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT), $foto]);
    $id = $pdo->lastInsertId();

    session_regenerate_id(true);
    $_SESSION['usuario_id'] = $id;
    gravarLog('CADASTRO', $id);

    responder(201, [
        'status'  => 'success',
        'message' => 'Cadastro realizado com sucesso!',
        'usuario' => ['id' => (int) $id, 'nome' => $nome, 'email' => $email, 'foto' => $foto],
    ]);
}

//Vai ver quem está logado
if ($acao === 'me') {
    $usuarioId = exigirLogin();

    $consulta = $pdo->prepare('SELECT id, nome, email, foto FROM usuarios WHERE id = ?');
    $consulta->execute([$usuarioId]);
    $usuario = $consulta->fetch();

    if (!$usuario) {
        responder(401, ['status' => 'error', 'message' => 'Usuário não encontrado.']);
    }
    $usuario['id'] = (int) $usuario['id'];
    responder(200, ['status' => 'success', 'usuario' => $usuario]);
}

// Logout
if ($acao === 'logout') {
    if (isset($_SESSION['usuario_id'])) {
        gravarLog('LOGOUT', $_SESSION['usuario_id']);
    }
    $_SESSION = [];
    session_destroy();
    responder(200, ['status' => 'success', 'message' => 'Você saiu do sistema.']);
}

// Esqueci a senha, aqui envia email
if ($acao === 'esqueci_senha') {
    $consulta = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
    $consulta->execute([$email]);
    $usuario = $consulta->fetch();

    if ($usuario) {
        // Código aleatório que vai no link no banco fica só o hash dele.
        $token = bin2hex(random_bytes(32));
        $expira = date('Y-m-d H:i:s', time() + 3600); // vale 1 hora

        $atualiza = $pdo->prepare('UPDATE usuarios SET token_hash = ?, token_expira = ? WHERE id = ?');
        $atualiza->execute([hash('sha256', $token), $expira, $usuario['id']]);

        $link = URL_FRONTEND . '/redefinirSenha?token=' . $token;
        $mensagem = '<p>Você pediu para redefinir sua senha no Equilibra.</p>'
            . '<p><a href="' . $link . '">Clique aqui para criar uma nova senha</a></p>'
            . '<p>O link vale por 1 hora.</p>';
        enviarEmail($email, 'Recuperação de senha - Equilibra', $mensagem);
        gravarLog('PEDIU_NOVA_SENHA', $usuario['id']);
    }

    responder(200, ['status' => 'success', 'message' => 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.']);
}

// Nova Senha
if ($acao === 'redefinir_senha') {
    $token = $dados['token'] ?? '';
    $novaSenha = $dados['novaSenha'] ?? '';

    if (!senhaForte($novaSenha)) {
        responder(400, ['status' => 'error', 'message' => 'A senha precisa de 8+ caracteres, com letra, número e símbolo.']);
    }

    // Procura quem tem o token, tambem se ele venceu ou não
    $consulta = $pdo->prepare('SELECT id FROM usuarios WHERE token_hash = ? AND token_expira >= ?');
    $consulta->execute([hash('sha256', $token), date('Y-m-d H:i:s')]);
    $usuario = $consulta->fetch();

    if (!$usuario) {
        responder(400, ['status' => 'error', 'message' => 'Link inválido ou expirado. Peça um novo.']);
    }

    // salva a nova senha e apaga o token, só dá para redefinir uma vez
    $atualiza = $pdo->prepare('UPDATE usuarios SET senha = ?, token_hash = NULL, token_expira = NULL WHERE id = ?');
    $atualiza->execute([password_hash($novaSenha, PASSWORD_DEFAULT), $usuario['id']]);

    gravarLog('TROCOU_SENHA', $usuario['id']);
    responder(200, ['status' => 'success', 'message' => 'Senha alterada com sucesso!']);
}

responder(400, ['status' => 'error', 'message' => 'Ação inválida.']);
