<?php
header("Content-Type: text/json; charset=utf8");
require_once("../../api/connect.php");

//valeur les plus récentes
$sql = "
SELECT
	indice.nom_indice,
	type_valeur.nom_type_valeur,
	valeur,
	DATE_FORMAT(date, '%Y-%m-%dT%TZ') AS date,
	(CASE type_valeur.couleur_type_valeur
			 WHEN '' THEN indice.couleur
			 ELSE type_valeur.couleur_type_valeur
	END) AS couleur
FROM `valeur_api` AS valeur
INNER JOIN type_valeur_api AS type_valeur ON type_valeur.id_type_valeur_api = valeur.id_type_valeur_api
INNER JOIN indice ON valeur.id_indice = indice.id_indice

-- On ne prend que les valeurs de moins de trois jours, ou, si il n'y en a pas, les valeurs
-- de la date la plus récente pour laquelle on a des données
WHERE date >= LEAST(DATE_SUB(CURDATE(),INTERVAL 3 DAY), (SELECT MAX(date) FROM valeur_api))
ORDER BY valeur.id_indice, valeur.date, valeur.id_type_valeur_api
";

$res = array();
foreach ($BDD->query($sql) as $row) {
  $res[] = array(
    "indice"     => $row['nom_indice'],
    "type"       => $row['nom_type_valeur'],
    "periode"    => $row['date'],
    "valeur"     => floatval($row['valeur']),
    "couleur"    => $row['couleur']
  );
}
echo json_encode($res);
?>
