<?php

require_once 'funcoes.php';

//aparece também a categoria que ainda não tem estratégia
$consulta = $pdo->query('SELECT c.id, c.nome, c.descricao, COUNT(e.id) AS total
                         FROM categorias c
                         LEFT JOIN estrategias e ON e.categoria_id = c.id
                         GROUP BY c.id, c.nome, c.descricao
                         ORDER BY c.nome');

responder(200, ['status' => 'success', 'data' => $consulta->fetchAll()]);
