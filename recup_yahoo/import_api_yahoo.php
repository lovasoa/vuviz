<?php

ini_set('xdebug.var_display_max_depth', 5);
ini_set('xdebug.var_display_max_children', 256);
ini_set('xdebug.var_display_max_data', 1024);


require_once("../api/connect.php");

//recuperation des indices tableau json
$sql = "
SELECT
  id_indice, nom_indice, nom_continent, sectoriel, couleur, symbole
FROM indice
INNER JOIN continent ON continent.id_continent = indice.id_continent
ORDER BY id_indice;
";
$res = array();
foreach ($BDD->query($sql) as $row) {
  $res[] = array(
    "id"        => intval($row['id_indice']),
    "nom"       => $row['nom_indice'],
    "continent" => $row['nom_continent'],
    "sectoriel" => boolval($row['sectoriel']),
    "couleur"     => $row['couleur'],
    "symbole"     => $row['symbole']
  );
}


foreach($res as $indice){//pour chaque indice
	echo $indice['nom'];	
	if($indice['symbole']!=""){//Si son symbole est non nul
			$value=get_value_api($indice['symbole'],$indice['id']);//on recupere les valeur de l'api
			insert_values_api($value,$BDD);//et on l'insert
	}
}

function insert_values_api($tab_val_indice,$BDD){//insert les min/max/fer/ouv d'un indice pour 1 jour

$stmt = $BDD->prepare("
INSERT INTO
  valeur_api (id_indice, date, valeur, id_type_valeur_api
  )
  VALUES ( ?      , ?     , ?            ,
          (SELECT id_type_valeur_api FROM type_valeur_api WHERE nom_type_valeur = ?))
");

	
foreach ($tab_val_indice as $valeur) {
  try{
  $ret = $stmt->execute(array(
      $valeur['id_indice'],
      $valeur['date'],
      $valeur['valeur'],
      $valeur['type_valeur_api']
  ));
  
     
  }
catch(Exception $e)
{
        die('Erreur : '.$e->getMessage());
}
 
 
}

}

//temps réel requete complètes:
// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20%28%22YHOO%22%29&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
//CONSOLE
// https://developer.yahoo.com/yql/console/?q=select%20*%20from%20yahoo.finance&env=store://datatables.org/alltableswithkeys#h=select+*+from+yahoo.finance.quotes+where+symbol+in+%28%22YHOO%22%29
function get_value_api($symbole,$id_indice){
	//Correspondance type_valeur
	$type_valeur=array('min'=>'day_low','max'=>'day_high','moy'=>'day_low', 'fer'=>'day_low','ouv'=>'day_low','actuel'=>'price');
	
	//recuperation du json de yahoo
	$json_yahoo=file_get_contents("http://finance.yahoo.com/webservice/v1/symbols/".$symbole."/quote?format=json&view=%E2%80%8C%E2%80%8Bdetail");
	$obj =  json_decode($json_yahoo,true); //true: tableau associatif
	// var_dump($obj); //source brut
	// var_dump( $field_api=$obj['list']['resources'][0]['resource']['fields']);// champs recupéré de la requette
	$field_api=$obj['list']['resources'][0]['resource']['fields'];// champs recupéré de la requette
	
	//transformation des données
	$data_api=[];
	$i=0;
	foreach($field_api as $key=>$value){//pour chaque champs
		if(in_array($key,$type_valeur)){//si le champ est un type de donnée on l'ajoute au tableau de donnée
			$data_api[]=array(
				"id_indice"=>$id_indice,
				"type_valeur_api"=>array_search( $key,$type_valeur),//recupere le nom fr du type
				// "date"=>$field_api['utctime'],
				"date"=>"2016-03-25 00:00:00",
				"valeur"=>$value,
				
			);
			$i++;
		}
	}
	var_dump($data_api);
	return $data_api;
};



/*
// $symb_indice="^YPL";
$url="http://finance.yahoo.com/webservice/v1/symbols/".$symb_indice."/quote?format=json&view=%E2%80%8C%E2%80%8Bdetail";
$json = file_get_contents($url);//retourne le contenu du fichier sous forme de chaine de caractère
var_dump($json);
$obj =  json_decode($json,true); //true: tableau associatif
var_dump($obj);
var_dump($obj['list']['resources'][0]);
var_dump($obj['list']['resources'][1]);
// */

?>