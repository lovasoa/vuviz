<?php
require_once("../../api/connect.php");
$valeurs = json_decode(file_get_contents("php://input"));
$res = array(
  "added"   => 0,
  "deleted" => 0,
  "failed"  => 0
);
$res["deleted"] = $BDD->exec("DELETE FROM valeur WHERE id_indice = " . intval($valeurs[0]->id_indice));
$stmt = $BDD->prepare("
INSERT INTO
  valeur (id_indice, periode, valeur, est_prevision, annuelle,
          id_type_valeur)
  VALUES (?        , ?      , ?     , ?            , ?        ,
          (SELECT id_type_valeur FROM type_valeur WHERE nom_type_valeur = ?))
");

$nbradded = 0;
foreach ($valeurs as $valeur) {
  $ret = $stmt->execute(array(
      $valeur->id_indice,
      $valeur->periode,
      $valeur->valeur,
      $valeur->prevision,
      $valeur->annuelle,
      $valeur->type
  ));
  $res["added"]  += intval($ret);
  $res["failed"] += intval(!$ret);
}
header("Content-Type: text/json; charset=utf8");
echo json_encode($res);
?>
