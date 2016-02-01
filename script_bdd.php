<?php

class Fchier_csv{
	public $chemin;
	public $entete=new array();
	public $ligne=new array();
	public $colonne=new array();
	public $bdd;
	public $fichier;
	
	function __construct($chemin)){
		$this->fichier=fopen($chemin, "r");
		
		while(!feof($this->$fichier))//lecture de chaque ligne
			$ligne=fgets($fichier, 1024);
			$tableau_cellule=explode(';', $ligne);
			if(key($ligne)==0){//on met la premiere ligne sera l'entête
				$this->entete->push($tableau_cellule));
			}else{//
				$this->ligne->push($tableau_cellule));
				//on boucle sur chaque ligne pour mettre les donnée dans chaque colonne
			}
		}
	}
	
	public function add_bdd($ligne){
			$date;
			$value= new array();
			
		foreach($this->ligne as $ligne){
			foreach($ligne as $valeur){
				if(key($ligne)==0){
					$date=$valeur;
				}else{
					$value=$valeur;);
				}
		}
		$ligne[0];
		$valeur=;
		$type_valeur= ;
		$sql="INSERT INTO table date, valeur, type_valeur,typevaleur2 VALUES (";
	
		
	}
	
	
}

$fichier_csv = new Fichier_csv("nom_du_fichier.text_ou_.csv", "r");

//tant qu'on est pas a la fin du fichier :
while (!feof($fichier))
{
// On recupere toute la ligne
$uneLigne = fgets($fichier, 1024);
//On met dans un tableau les differentes valeurs trouvés (ici séparées par un ';')
$tableauValeurs = explode(';', $uneLigne);
// On crée la requete pour inserer les donner (ici il y a 12 champs donc de [0] a [11])
$sql="INSERT INTO Balance VALUES ('".$tableauValeurs[0]."', '".$tableauValeurs[1]."', '".$tableauValeurs[2]."', '".$tableauValeurs[3]."', '".$tableauValeurs[4]."', '".$tableauValeurs[5]."', '".$tableauValeurs[6]."', '".$tableauValeurs[7]."', '".$tableauValeurs[8]."', '".$tableauValeurs[9]."', '".$tableauValeurs[10]."', '".$tableauValeurs[11]."')";

$req=mysql_query($sql)or die (mysql_error());
// la ligne est finie donc on passe a la ligne suivante (boucle)
}
//vérification et envoi d'une réponse à l'utilisateur
if ($req)
{
echo"Ajout dans la base de données effectué avec succès";
}
else
{
echo"Echec dans l'ajout dans la base de données";
}



?>