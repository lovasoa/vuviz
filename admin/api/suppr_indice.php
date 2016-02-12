<?php
header("Content-Type: text/json; charset=utf8");
require_once("../../api/connect.php");
$stmt = $BDD->prepare("DELETE FROM indice WHERE id_indice = ? LIMIT 1");
$data = json_decode(file_get_contents("php://input"));
$res = $stmt->execute(array($data->id));
echo json_encode($res);
?>
