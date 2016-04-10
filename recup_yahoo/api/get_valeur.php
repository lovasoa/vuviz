<?php
header("Content-Type: text/json; charset=utf8");
require_once("../../api/connect.php");

/*
//toutes les valeurs
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
*/

//valeur les plus récentes
$stmt = $BDD->prepare("

SELECT
	indice.nom_indice,
	type_valeur_api.nom_type_valeur,
	t1.valeur,
	t1.date,
	(CASE type_valeur_api.couleur_type_valeur
			 WHEN '' THEN indice.couleur
			 ELSE type_valeur_api.couleur_type_valeur
	END) AS couleur
FROM `valeur_api` as t1
INNER JOIN
(
	SELECT t2.id_indice,
	t2.id_type_valeur_api,
	t2.valeur,
	max(t2.date) AS date_max
	FROM `valeur_api` as t2
	GROUP BY t2.id_indice, t2.id_type_valeur_api
) tmp 
	ON tmp.id_indice = t1.id_indice
	AND tmp.id_type_valeur_api = t1.id_type_valeur_api
	AND tmp.date_max = t1.date
    
INNER JOIN type_valeur_api ON type_valeur_api.id_type_valeur_api = t1.id_type_valeur_api
INNER JOIN indice ON t1.id_indice = indice.id_indice
GROUP BY t1.id_indice, t1.id_type_valeur_api

");


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
/*
foreach ($stmt as $row) {
	$res[$row['nom_indice']]=
  $res[] = array(
    "indice"     => $row['nom_indice'],
    "type"       => $row['nom_type_valeur'],
    "date"       => $row['date'],
    "valeur"     => floatval($row['valeur']),
	"couleur"  => $row['couleur']
  );
}
*/

echo json_encode($res);



?>
