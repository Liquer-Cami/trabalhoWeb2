<?php

require_once 'funcoes.php';

$usuarioId = exigirLogin();
$metodo = $_SERVER['REQUEST_METHOD'];
$dados = lerDados();

// Coloca a tarefa no formato que o React espera
function montarTarefa($pdo, $t)
{
    // dias em que uma tarefa que se repete foi concluída
    $busca = $pdo->prepare('SELECT data FROM tarefa_ocorrencias WHERE tarefa_id = ?');
    $busca->execute([$t['id']]);

    $status = 'Pendente';
    if ($t['concluida']) {
        $status = 'Concluída';
    }

    return [
        'id'                     => $t['id'],
        'titulo'                 => $t['titulo'],
        'tempo_estimado'         => $t['tempo_estimado'],
        'tempo_realizado'        => $t['tempo_realizado'],
        'prioridade'             => $t['prioridade'],
        'dificuldade'            => $t['dificuldade'],
        'recorrencia'            => $t['recorrencia'],
        'ocorrencias_concluidas' => $busca->fetchAll(PDO::FETCH_COLUMN),
        'status'                 => $status,
        'observacao'             => $t['observacao'] ?? '',
        'data'                   => $t['data'],
    ];
}

// LISTAR 
if ($metodo === 'GET') {
    $consulta = $pdo->prepare('SELECT * FROM tarefas WHERE usuario_id = ? ORDER BY data, id');
    $consulta->execute([$usuarioId]);

    $lista = [];
    foreach ($consulta->fetchAll() as $t) {
        $lista[] = montarTarefa($pdo, $t);
    }
    responder(200, ['status' => 'success', 'data' => $lista]);
}

//CRIAR
if ($metodo === 'POST') {
    $titulo = trim($dados['titulo'] ?? '');
    if ($titulo === '') {
        responder(400, ['status' => 'error', 'message' => 'O título é obrigatório.']);
    }

    $insere = $pdo->prepare('INSERT INTO tarefas (usuario_id, titulo, tempo_estimado, prioridade, dificuldade, recorrencia, observacao, data)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $insere->execute([
        $usuarioId,
        $titulo,
        $dados['tempo_estimado'] ?? '',
        $dados['prioridade'] ?? 'Baixa',
        $dados['dificuldade'] ?? 'Fácil',
        $dados['recorrencia'] ?? '',
        $dados['observacao'] ?? '',
        $dados['data'] ?? date('Y-m-d'),
    ]);

    $busca = $pdo->prepare('SELECT * FROM tarefas WHERE id = ?');
    $busca->execute([$pdo->lastInsertId()]);
    responder(201, ['status' => 'success', 'message' => 'Tarefa criada com sucesso!', 'data' => montarTarefa($pdo, $busca->fetch())]);
}

//EDITAR
if ($metodo === 'PUT') {
    $titulo = trim($dados['titulo'] ?? '');
    if ($titulo === '') {
        responder(400, ['status' => 'error', 'message' => 'O título é obrigatório.']);
    }

    $atualiza = $pdo->prepare('UPDATE tarefas SET titulo = ?, tempo_estimado = ?, tempo_realizado = ?, prioridade = ?,
                               dificuldade = ?, recorrencia = ?, observacao = ?, data = ?
                               WHERE id = ? AND usuario_id = ?');
    $atualiza->execute([
        $titulo,
        $dados['tempo_estimado'] ?? '',
        $dados['tempo_realizado'] ?? '',
        $dados['prioridade'],
        $dados['dificuldade'],
        $dados['recorrencia'] ?? '',
        $dados['observacao'] ?? '',
        $dados['data'],
        $dados['id'],
        $usuarioId,
    ]);
    responder(200, ['status' => 'success', 'message' => 'Tarefa atualizada com sucesso!']);
}

//CONCLUIR
if ($metodo === 'PATCH') {
    $id = $dados['id'];
    $concluida = !empty($dados['concluida']);

    // Confere se a tarefa é deste usuário
    $busca = $pdo->prepare('SELECT id FROM tarefas WHERE id = ? AND usuario_id = ?');
    $busca->execute([$id, $usuarioId]);
    if (!$busca->fetch()) {
        responder(404, ['status' => 'error', 'message' => 'Tarefa não encontrada.']);
    }

    if (isset($dados['data_ocorrencia'])) {
        // tarefa que se repete: marca ou desmarca só aquele dia
        if ($concluida) {
            $pdo->prepare('INSERT IGNORE INTO tarefa_ocorrencias (tarefa_id, data) VALUES (?, ?)')->execute([$id, $dados['data_ocorrencia']]);
        } else {
            $pdo->prepare('DELETE FROM tarefa_ocorrencias WHERE tarefa_id = ? AND data = ?')->execute([$id, $dados['data_ocorrencia']]);
        }
    } else {
        // tarefa normal: muda o campo concluida
        $pdo->prepare('UPDATE tarefas SET concluida = ? WHERE id = ?')->execute([$concluida ? 1 : 0, $id]);
    }
    responder(200, ['status' => 'success', 'message' => 'Tarefa atualizada com sucesso!']);
}

//APAGAR
if ($metodo === 'DELETE') {
    $apaga = $pdo->prepare('DELETE FROM tarefas WHERE id = ? AND usuario_id = ?');
    $apaga->execute([$dados['id'], $usuarioId]);
    responder(200, ['status' => 'success', 'message' => 'Tarefa removida com sucesso!']);
}
