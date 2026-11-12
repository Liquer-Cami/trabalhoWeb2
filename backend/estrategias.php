<?php

require_once 'funcoes.php';

$id = (int) ($_GET['categoria'] ?? 0); 

$busca = $pdo->prepare('SELECT * FROM categorias WHERE id = ?');
$busca->execute([$id]);
$categoria = $busca->fetch();

if (!$categoria) {
    responder(404, ['status' => 'error', 'message' => 'Categoria não encontrada.']);
}

$consulta = $pdo->prepare('SELECT id, titulo, descricao_curta, duracao_min, dificuldade
                           FROM estrategias WHERE categoria_id = ? ORDER BY titulo');
$consulta->execute([$id]);

responder(200, ['status' => 'success', 'data' => [
    'categoria'   => $categoria,
    'estrategias' => $consulta->fetchAll(),
]]);
