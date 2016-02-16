<?php
header("Content-Type: text/json; charset=utf8");
require_once("./connect.php");
$stmt = $BDD->prepare("
SELECT
	indice.nom_indice, type_valeur.nom_type_valeur, valeur, periode, est_prevision
FROM `valeur`
INNER JOIN type_valeur ON type_valeur.id_type_valeur = valeur.id_type_valeur
INNER JOIN indice ON valeur.id_indice = indice.id_indice
WHERE annuelle = ?
");
$stmt->execute(array($_GET['annuelle']));
$res = array();
foreach ($stmt as $row) {
  $res[] = array(
    "nom_indice" => $row['nom_indice'],
    "type"       => $row['nom_type_valeur'],
    "valeur"     => $row['valeur'],
    "periode"    => $row['periode'],
    "prevision"  => boolval($row['est_prevision'])
  );
}
echo json_encode($res);
?>
