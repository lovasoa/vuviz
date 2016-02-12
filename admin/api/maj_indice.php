<?php
header("Content-Type: text/json; charset=utf8");
require_once("../../api/connect.php");
$stmt = $BDD->prepare("
UPDATE indice
SET
  nom_indice   = ?,
  id_continent = (SELECT id_continent FROM continent WHERE continent.nom_continent = ?),
  couleur      = ?,
  sectoriel    = ?
WHERE
  id_indice = ?
");
$data = json_decode(file_get_contents("php://input"));
$opts = array($data->nom, $data->continent, $data->couleur, $data->sectoriel, $data->id);
$res = $stmt->execute($opts);
echo json_encode($res);
?>
