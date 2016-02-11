<?php
header("Content-Type: text/json; charset=utf8");
require_once("./connect.php");
$sql = "
SELECT
  id_indice, nom_indice, nom_continent, sectoriel, couleur
FROM indice
INNER JOIN continent ON continent.id_continent = indice.id_continent;
";
$res = array();
foreach ($BDD->query($sql) as $row) {
  $res[] = array(
    "id"        => intval($row['id_indice']),
    "nom"       => $row['nom_indice'],
    "continent" => $row['nom_continent'],
    "sectoriel" => boolval($row['sectoriel']),
    "couleur"     => $row['couleur']
  );
}
echo json_encode($res);
?>
