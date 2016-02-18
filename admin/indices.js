var app = angular.module('vuvizApp', []);

app.controller('IndicesController', function($scope, $http) {
  function ListeIndices() {
    this.dernier_id = 0;
    this.liste = [];
    this.continents = [];
    this.index_nom = {}; //Associe les noms d'indice à leur valeur
    this.rafraichir();
  }
  ListeIndices.prototype.remove = function (indice) {
    delete this.index_nom[indice.d.nom];
    this.liste = this.liste.filter(function(i){return i !== indice});
  };
  ListeIndices.prototype.nouvel_indice_vide = function() {
    this.ajout_indice({
        id: this.dernier_id + 1,
        nom: "",
        couleur: "#8800aa",
        sectoriel: false,
        continent: "Europe"
    }, true);
  };
  ListeIndices.prototype.ajout_indice = function (data, nouveau) {
    var indice = new Indice(data, nouveau);
    if (data.id > this.dernier_id) this.dernier_id = data.id;
    if (this.continents.indexOf(data.continent) === -1) {
      this.continents.push(data.continent);
    }
    this.index_nom[data.nom] = indice;
    this.liste.push(indice);
  };
  ListeIndices.prototype.rafraichir = function() {
    //Va chercher la liste des indices sur le serveur
    var that = this;
    $http.get("../api/indices.php").then(function(res){
      that.liste = [];
      that.continents = [];
      that.index_nom = {};
      for (var i = 0; i < res.data.length; i++) {
        that.ajout_indice(res.data[i]);
      }
      that.nouvel_indice_vide();
    });
  }

  // Classe indice
  function Indice(data, nouveau) {
    this.nouveau     = (nouveau === true);
    this.suppression = false;
    this.disabled    = false;
    this.valeurs     = [];
    this.d           = data;
  }
  Indice.find = function(nom) {
    //Trouve un indice dans la liste des indices
    return $scope.indices.filter(function(i){return i.d.nom === nom})[0];
  };
  Indice.prototype.clic_supprimer = function clic_supprimer () {
      // Demande une confirmation la première fois, ensuite supprime l'indice
      if (this.suppression) {this.supprimer()} else {this.suppression = true};
  };
  Indice.prototype.supprimer = function() {
    // Supprime un indice de la base de données
    var indice = this;
    $http.post("api/suppr_indice.php", this.d).then(function(){
      $scope.status = "✓";
      $scope.indices.remove(indice);
    }, function() {
      $scope.status = "⚠";
    });
    this.disabled = true;
    $scope.status = "⥀";
  };
  Indice.prototype.post = function postIndice() {
    // Met à jour la base de données avec un indice modifié
    var indice = this;
    var url = indice.nouveau ? "api/creer_indice.php" : "api/maj_indice.php";
    $http.post(url, indice.d).then(function(){
      $scope.status = "✓";
      if (indice.nouveau) $scope.indices.nouvel_indice_vide();
      indice.disabled = indice.nouveau = false;
    }, function() {
      $scope.status = "⚠";
    });
    $scope.status = "⥀";
    indice.disabled = true;
  };
  Indice.prototype.affiche_recherche = function affiche_recherche(recherche) {
    //Détermine si un indice correspond à une recherche ou non
    var d = this.d;
    return d.continent.toLowerCase().indexOf(recherche.toLowerCase()) === 0 ||
           d.nom.toLowerCase().indexOf(recherche.toLowerCase()) >= 0 ||
           this.nouveau;
  };

  $http.get("../api/valeurs.php?duree=annuelle").then(function(res){
    $scope.valeurs = res.data;
  });

  $scope.status = "✓";
  $scope.indices = new ListeIndices;
  $scope.recherche = "";
  $scope.valeurs = [];
});

app.filter("cherche", function($filter){
  return function (indices, recherche){
    return $filter("filter")(indices, function correspond(indice) {
      return indice.affiche_recherche(recherche);
    });
  };
});
