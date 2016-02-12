<?php
header("Content-Type: text/json; charset=utf8");
require_once("../../api/connect.php");
$stmt = $BDD->prepare("
INSERT INTO indice
  (id_indice, nom_indice,
  id_continent,
  couleur, sectoriel)
VALUES
  (?, ?,
  (SELECT id_continent FROM continent WHERE continent.nom_continent = ?),
  ?, ?)
");
$data = json_decode(file_get_contents("php://input"));
$opts = array($data->id, $data->nom, $data->continent, $data->couleur, $data->sectoriel);
$res = $stmt->execute($opts);
echo json_encode($res);
?>
