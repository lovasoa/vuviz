<?php
header("Content-Type: text/json; charset=utf8");
require_once("../../api/connect.php");
$stmt = $BDD->prepare("
SELECT
	indice.nom_indice,
	type_valeur_api.nom_type_valeur,
	valeur,
	date,
	(CASE type_valeur_api.couleur_type_valeur
			 WHEN '' THEN indice.couleur
			 ELSE type_valeur_api.couleur_type_valeur
	END) AS couleur
FROM `valeur_api`
INNER JOIN type_valeur_api ON type_valeur_api.id_type_valeur_api = valeur_api.id_type_valeur_api
INNER JOIN indice ON valeur_api.id_indice = indice.id_indice
ORDER BY valeur_api.id_indice, valeur_api.date, valeur_api.id_type_valeur_api
");
// $stmt->execute(array($_GET['duree'] === "annuelle"));
$stmt->execute(array());
$res = array();
foreach ($stmt as $row) {

  $res[] = array(
    "indice"     => $row['nom_indice'],
    "type"       => $row['nom_type_valeur'],
    "date"       => $row['date'],
    "valeur"     => floatval($row['valeur']),
	"couleur"  => $row['couleur']
  );
}
echo json_encode($res);
?>
