<?php

require_once 'funcoes.php';

$usuarioId = exigirLogin();

//Último check-in
$consulta = $pdo->prepare('SELECT * FROM checkins WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 1');
$consulta->execute([$usuarioId]);
$checkin = $consulta->fetch();

if (!$checkin) {
    responder(400, ['status' => 'error', 'message' => 'Faça um check-in antes de pedir recomendações.']);
}

// nomes dos fatores de estresse desse check-in, separados por vírgula
$busca = $pdo->prepare('SELECT f.nome FROM checkin_fatores cf JOIN fatores_estresse f ON f.id = cf.fator_id WHERE cf.checkin_id = ?');
$busca->execute([$checkin['id']]);
$fatores = implode(', ', $busca->fetchAll(PDO::FETCH_COLUMN));

//tarefas pendentes
$consulta = $pdo->prepare('SELECT id, titulo, prioridade, dificuldade, tempo_estimado, data
                           FROM tarefas WHERE usuario_id = ? AND concluida = 0 LIMIT 40');
$consulta->execute([$usuarioId]);
$tarefas = $consulta->fetchAll();

if (count($tarefas) === 0) {
    responder(200, ['status' => 'success', 'message' => 'Você não tem tarefas pendentes para recomendar.', 'data' => []]);
}

$prompt = "Você ajuda pessoas neurodivergentes (TEA e TDAH) a organizar a rotina.\n"
    . "Check-in de hoje: humor = {$checkin['humor']}, fatores de estresse = {$fatores}, observação = {$checkin['observacao']}\n"
    . "Tarefas pendentes (JSON): " . json_encode($tarefas, JSON_UNESCAPED_UNICODE) . "\n"
    . "Escolha até 5 dessas tarefas, na ordem em que a pessoa deve fazer, apenas as tarefas do dia selecionado.\n"
    . "Se o humor for mal ou muito-mal, prefira prioridade Alta com dificuldade Fácil e evite as Difíceis.\n"
    . "Se for bem ou muito-bem, priorize as de prioridade Alta, mesmo as difíceis.\n"
    . "Não crie tarefas novas. Responda só com JSON neste formato: [{\"id\": 1, \"motivo\": \"frase curta e acolhedora\"}]";

$corpo = [
    'contents' => [['parts' => [['text' => $prompt]]]],
    'generationConfig' => ['responseMimeType' => 'application/json'], // pede a resposta em JSON
];

$curl = curl_init('https://generativelanguage.googleapis.com/v1beta/models/' . GEMINI_MODELO . ':generateContent');
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);  // devolve a resposta em vez de imprimir
curl_setopt($curl, CURLOPT_TIMEOUT, 30);           
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'x-goog-api-key: ' . GEMINI_CHAVE]);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($corpo));
$resposta = curl_exec($curl);
$codigo = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($codigo !== 200) {
    file_put_contents(__DIR__ . '/logs/ia.log', date('c') . ' | HTTP ' . $codigo . ' | ' . substr($resposta, 0, 300) . PHP_EOL, FILE_APPEND);
    responder(502, ['status' => 'error', 'message' => 'Não foi possível gerar as recomendações agora. Tente de novo.']);
}

//texto fica em candidates[0].content.parts[0].text e é um JSON
$dadosIa = json_decode($resposta, true);
$escolhas = json_decode($dadosIa['candidates'][0]['content']['parts'][0]['text'] ?? '', true);

if (!is_array($escolhas)) {
    responder(502, ['status' => 'error', 'message' => 'A IA respondeu em um formato inesperado. Tente de novo.']);
}

// confere a resposta: só vale id que está na lista de tarefas do usuário
$porId = [];
foreach ($tarefas as $t) {
    $porId[$t['id']] = $t;
}

$sugestoes = [];
foreach ($escolhas as $item) {
    $id = $item['id'] ?? 0;
    if (!isset($porId[$id]) || count($sugestoes) === 5) {
        continue;
    }
    $tarefa = $porId[$id];          // os dados vêm do banco, não da IA
    $tarefa['motivo'] = $item['motivo'] ?? '';
    $sugestoes[] = $tarefa;
    unset($porId[$id]);             // não repete a mesma tarefa

    // guarda que esta tarefa foi recomendada neste check-in
    $pdo->prepare('INSERT IGNORE INTO tarefa_checkins (tarefa_id, checkin_id) VALUES (?, ?)')->execute([$id, $checkin['id']]);
}

responder(200, ['status' => 'success', 'data' => $sugestoes]);
