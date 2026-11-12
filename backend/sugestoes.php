<?php

require_once 'funcoes.php';

$usuarioId = exigirLogin();
$hoje = date('Y-m-d');

$consulta = $pdo->prepare('SELECT * FROM checkins WHERE usuario_id = ? AND DATE(criado_em) = ? ORDER BY criado_em DESC LIMIT 1');
$consulta->execute([$usuarioId, $hoje]);
$checkin = $consulta->fetch();

if (!$checkin) {
    responder(400, ['status' => 'error', 'message' => 'Faça o check-in de hoje antes de pedir recomendações.']);
}

$busca = $pdo->prepare('SELECT f.nome FROM checkin_fatores cf JOIN fatores_estresse f ON f.id = cf.fator_id WHERE cf.checkin_id = ?');
$busca->execute([$checkin['id']]);
$fatores = implode(', ', $busca->fetchAll(PDO::FETCH_COLUMN));

// Tarefas pendentes (as que se repetem e já foram feitas hoje ficam de fora)
$consulta = $pdo->prepare('SELECT id, titulo, prioridade, dificuldade, tempo_estimado, data, recorrencia
                           FROM tarefas
                           WHERE usuario_id = ? AND concluida = 0
                           AND id NOT IN (SELECT tarefa_id FROM tarefa_ocorrencias WHERE data = ?)');
$consulta->execute([$usuarioId, $hoje]);

// Fica só com as tarefas de HOJE 
$tarefas = [];
foreach ($consulta->fetchAll() as $t) {
    $dias = (int) ((strtotime($hoje) - strtotime($t['data'])) / 86400); 

    if ($t['recorrencia'] === '') {
        $deHoje = $t['data'] === $hoje;          
    } elseif ($dias < 0 || $dias >= 30) {
        $deHoje = false;                           
    } elseif ($t['recorrencia'] === 'Diária') {
        $deHoje = true;
    } elseif ($t['recorrencia'] === 'Semanal') {
        $deHoje = $dias % 7 === 0;              
    } else {
        $deHoje = substr($t['data'], 8, 2) === date('d'); 
    }

    if ($deHoje) {
        $tarefas[] = $t;
    }
}

if (count($tarefas) === 0) {
    responder(200, ['status' => 'success', 'message' => 'Você não tem tarefas pendentes para hoje.', 'data' => []]);
}

$prompt = "Você ajuda pessoas neurodivergentes (TEA e TDAH) a organizar a rotina.\n"
    . "Check-in de hoje: humor = {$checkin['humor']}, fatores de estresse = {$fatores}, observação = {$checkin['observacao']}\n"
    . "Tarefas de hoje (JSON): " . json_encode($tarefas, JSON_UNESCAPED_UNICODE) . "\n"
    . "Escolha até 5 dessas tarefas, na ordem em que a pessoa deve fazer.\n"
    . "Se o humor for mal ou muito-mal, prefira prioridade Alta com dificuldade Fácil e evite as Difíceis.\n"
    . "Se for bem ou muito-bem, priorize as de prioridade Alta, mesmo as difíceis.\n"
    . "Não crie tarefas novas. Responda só com JSON neste formato: [{\"id\": 1, \"motivo\": \"frase curta e acolhedora\"}]";

$corpo = [
    'contents' => [['parts' => [['text' => $prompt]]]],
    'generationConfig' => ['responseMimeType' => 'application/json'], // pede a resposta em JSON
];

$curl = curl_init('https://generativelanguage.googleapis.com/v1beta/models/' . GEMINI_MODELO . ':generateContent');
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);  
curl_setopt($curl, CURLOPT_TIMEOUT, 30);
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'x-goog-api-key: ' . GEMINI_CHAVE]);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($corpo));
$resposta = curl_exec($curl);
$codigo = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($codigo !== 200) {
    gravarLog('IA_FALHOU HTTP ' . $codigo, $usuarioId);
    responder(502, ['status' => 'error', 'message' => 'Não foi possível gerar as recomendações agora. Tente de novo.']);
}

//texto fica em candidates[0].content.parts[0].text e é um JSON
$dadosIa = json_decode($resposta, true);
$escolhas = json_decode($dadosIa['candidates'][0]['content']['parts'][0]['text'] ?? '', true);

if (!is_array($escolhas)) {
    responder(502, ['status' => 'error', 'message' => 'A IA respondeu em um formato inesperado. Tente de novo.']);
}

$sugestoes = [];
foreach ($escolhas as $item) {
    foreach ($tarefas as $t) {
        if ($t['id'] == $item['id']) {
            $t['motivo'] = $item['motivo'] ?? '';
            $sugestoes[] = $t;

            $pdo->prepare('INSERT IGNORE INTO tarefa_checkins (tarefa_id, checkin_id) VALUES (?, ?)')->execute([$t['id'], $checkin['id']]);
        }
    }
}

responder(200, ['status' => 'success', 'data' => $sugestoes]);
