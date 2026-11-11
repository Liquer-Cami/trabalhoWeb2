<?php

require_once 'funcoes.php';

$tabelas = [
    'estrategia' => 'estrategias',
    'categoria'  => 'categorias',
];

$tipo = $_GET['tipo'] ?? '';
$id = (int) ($_GET['id'] ?? 0);

if (!isset($tabelas[$tipo])) {
    responder(400, ['status' => 'error', 'message' => 'Tipo inválido.']);
}

$consulta = $pdo->prepare('SELECT * FROM ' . $tabelas[$tipo] . ' WHERE id = ?');
$consulta->execute([$id]);
$item = $consulta->fetch();

if (!$item) {
    responder(404, ['status' => 'error', 'message' => 'Item não encontrado.']);
}

responder(200, ['status' => 'success', 'data' => $item]);
