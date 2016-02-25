<?php
require_once("../../api/connect.php");

$data = json_decode(file_get_contents("php://input"));
$coms = $data->commentaires;
$types = $data->types;

$BDD->exec("DELETE FROM commentaire_indice");
$BDD->exec("DELETE FROM commentaire");
$BDD->exec("DELETE FROM type_commentaire");

$res = array("ajoutes"=>0, "echecs"=>0);
$nvType = $BDD->prepare("
INSERT INTO type_commentaire
       (id_type_commentaire, description, icone, couleur)
VALUES (?                  , ?          , ?    , ?      )");
foreach ($types as $type) {
  $r = $nvType->execute(array(
    $type->id,
    $type->description,
    $type->icone,
    $type->couleur
  ));
  $res["ajoutes"] += $r;
  $res["echecs"]  += !$r;
}

$nvCom = $BDD->prepare("
INSERT INTO commentaire
       (id_commentaire, id_type_commentaire, texte, date)
VALUES (?             , ?                  , ?    , ?   )");
$nvIdx = $BDD->prepare("
INSERT INTO commentaire_indice
       (id_commentaire, id_indice)
VALUES (?             , ?        )");

foreach ($coms as $com) {
  $r = $nvCom->execute(array(
    $com->id,
    $com->type,
    $com->texte,
    $com->date
  ));
  $res["ajoutes"] += $r;
  $res["echecs"]  += !$r;
  foreach ($com->indices as $indice) {
    $r = $nvIdx->execute(array(
      $com->id,
      $indice
    ));
    $res["ajoutes"] += $r;
    $res["echecs"]  += !$r;
  }
}

header("Content-Type: text/json; charset=utf8");
echo json_encode($res);
?>
