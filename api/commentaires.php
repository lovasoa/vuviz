<?php
require_once("./connect.php");
$stmt = $BDD->prepare("
SELECT
	commentaire.id_commentaire, commentaire.texte, commentaire.date,
	commentaire.id_type_commentaire
FROM commentaire
");
$stmtIndices = $BDD->prepare("SELECT id_indice FROM commentaire_indice WHERE id_commentaire = ?");
$stmt->execute();
$coms = array();
foreach ($stmt as $row) {
  $id = intval($row['id_commentaire']);
	$stmtIndices->execute(array($id));
	$indices = array();
	foreach ($stmtIndices as $indice) {
		$indices[] = intval($indice['id_indice']);
	}
	$coms[] = array(
    "id"         => $id,
    "texte"      => $row['texte'],
    "date"       => $row['date'],
    "type"       => intval($row['id_type_commentaire']),
		"indices"    => $indices
  );
}

$stmt = $BDD->prepare("
SELECT
	id_type_commentaire, description, icone, couleur
FROM type_commentaire
ORDER BY id_type_commentaire
");
$types = array();
$stmt->execute();
foreach ($stmt as $row) {
  $id = intval($row['id_type_commentaire']);
	$types[$id] = array(
    "id"          => $id,
    "description" => $row['description'],
    "couleur"     => $row['couleur'],
    "icone"       => $row['icone']
  );
}

$res = array(
  "commentaires" => $coms,
  "types"        => $types
);
header("Content-Type: text/json; charset=utf8");
echo json_encode($res);
?>
