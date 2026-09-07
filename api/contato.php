<?php

// api/contato.php - recebe um contato via POST e grava no banco.

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight do navegador
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Aceita somente POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'erro' => 'Use POST.'
    ]);
    exit;
}

// Ler o JSON enviado pelo Angular
$dados = json_decode(file_get_contents('php://input'), true);

if (!is_array($dados)) {
    http_response_code(400);
    echo json_encode([
        'erros' => ['JSON invalido.']
    ]);
    exit;
}

// Dados recebidos
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$mensagem = trim($dados['mensagem'] ?? '');

// Validacao
$erros = [];

if ($nome === '') {
    $erros[] = 'O nome e obrigatorio.';
}

if ($email === '') {
    $erros[] = 'O e-mail e obrigatorio.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros[] = 'O e-mail e invalido.';
}

if (strlen($mensagem) < 10) {
    $erros[] = 'Mensagem com 10+ caracteres.';
}

if (!empty($erros)) {
    http_response_code(400);

    echo json_encode([
        'erros' => $erros
    ]);

    exit;
}

// Conexao com o banco
require __DIR__ . '/../conexao.php';

// INSERT usando prepared statement
$sql = "INSERT INTO contatos (nome, email, mensagem)
        VALUES (:nome, :email, :mensagem)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    ':nome' => $nome,
    ':email' => $email,
    ':mensagem' => $mensagem
]);

// Resposta de sucesso
http_response_code(201);

echo json_encode([
    'sucesso' => true,
    'id' => (int) $pdo->lastInsertId(),
    'mensagem' => 'Contato recebido com sucesso!'
]);