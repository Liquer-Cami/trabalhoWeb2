<?php

require_once 'funcoes.php';

$usuarioId = exigirLogin();
$metodo = $_SERVER['REQUEST_METHOD'];

//lista todos os checkins 
if ($metodo === 'GET') {
    $consulta = $pdo->prepare('SELECT * FROM checkins WHERE usuario_id = ? ORDER BY criado_em DESC');
    $consulta->execute([$usuarioId]);

    //fatores de estresse de cada check-in
    $buscaFatores = $pdo->prepare('SELECT f.nome FROM checkin_fatores cf
                                   JOIN fatores_estresse f ON f.id = cf.fator_id
                                   WHERE cf.checkin_id = ?');
    $lista = [];
    foreach ($consulta->fetchAll() as $c) {
        $buscaFatores->execute([$c['id']]);
        $lista[] = [
            'id'         => $c['id'],
            'humor'      => $c['humor'],
            'fatores'    => $buscaFatores->fetchAll(PDO::FETCH_COLUMN),
            'observacao' => $c['observacao'] ?? '',
            'data'       => $c['criado_em'],
        ];
    }
    responder(200, ['status' => 'success', 'data' => $lista]);
}

//Registra novo checkin
if ($metodo === 'POST') {
    $dados = lerDados();
    $humor = $dados['emoticon'] ?? '';
    $fatores = $dados['fatores'] ?? [];
    $observacao = trim($dados['observacao'] ?? '');

    if (!in_array($humor, ['muito-bem', 'bem', 'neutro', 'mal', 'muito-mal'])) {
        responder(400, ['status' => 'error', 'message' => 'Selecione uma emoção válida.']);
    }

    $insere = $pdo->prepare('INSERT INTO checkins (usuario_id, humor, observacao) VALUES (?, ?, ?)');
    $insere->execute([$usuarioId, $humor, $observacao]);
    $checkinId = $pdo->lastInsertId();

    //cada fator marcado ao seu checkin, se ele não existir é criado
    foreach ($fatores as $nome) {
        $pdo->prepare('INSERT IGNORE INTO fatores_estresse (nome) VALUES (?)')->execute([$nome]);

        $busca = $pdo->prepare('SELECT id FROM fatores_estresse WHERE nome = ?');
        $busca->execute([$nome]);
        $fatorId = $busca->fetchColumn();

        $pdo->prepare('INSERT IGNORE INTO checkin_fatores (checkin_id, fator_id) VALUES (?, ?)')->execute([$checkinId, $fatorId]);
    }

    responder(201, ['status' => 'success', 'message' => 'Check-in realizado com sucesso!']);
}
