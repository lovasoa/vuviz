var app = angular.module('vuvizApp', []);

app.controller('IndicesController', function($scope, $http) {
  function ListeIndices() {
    this.dernier_id = 0;
    this.liste = [];
    this.continents = [];
    this.index_nom = {}; //Associe les noms d'indice à leur valeur
    this.rafraichir();
  }
  ListeIndices.prototype.recherche = function (nom) {
    return this.index_nom[nom];
  };
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
    requete({
      url: "../api/indices.php",
      callback: function(res){
        that.liste = [];
        that.continents = [];
        that.index_nom = {};
        for (var i = 0; i < res.data.length; i++) {
          that.ajout_indice(res.data[i]);
        }
        that.nouvel_indice_vide();

        //Recherche des valeurs des indices dans l'API
        requete({
          url: "../api/valeurs.php?duree=annuelle",
          callback: function(res){
            for (var i = 0; i < res.data.length; i++) {
              var val = res.data[i];
              var indice = that.recherche(val.indice);
              if (!indice) {
                console.error("Valeur reçue pour un indice inconnu: " + val.indice);
                continue;
              }
              indice.ajout_valeur(val);
            }
          }
        });
      }
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
  Indice.prototype.ajout_valeur = function (data) {
    this.valeurs.push(new Valeur(this, data));
  };
  Indice.prototype.clic_supprimer = function clic_supprimer () {
      // Demande une confirmation la première fois, ensuite supprime l'indice
      if (this.suppression) {this.supprimer()} else {this.suppression = true};
  };
  Indice.prototype.supprimer = function() {
    // Supprime un indice de la base de données
    var indice = this;
    indice.disabled = true;
    requete({
      url  : "api/suppr_indice.php",
      data : indice.d,
      callback : function(res) {
        $scope.indices.remove(indice);
      }
    });
  };
  Indice.prototype.post = function postIndice() {
    // Met à jour la base de données avec un indice modifié
    var indice = this;
    indice.disabled = true;
    console.log(this.valeurs);
    requete({
      url  : indice.nouveau ? "api/creer_indice.php" : "api/maj_indice.php",
      data : indice.d,
      callback : function() {
        if (indice.nouveau) $scope.indices.nouvel_indice_vide();
        indice.disabled = indice.nouveau = false;
        requete({
          url: "api/maj_valeurs.php",
          data: indice.formater_valeurs()
        });
      }
    });
  };
  Indice.prototype.formater_valeurs = function() {
    // Supprime les valeurs invalides
    this.valeurs = this.valeurs.filter(function(val){return val.valide()})
    // Retourne les données à envoyer au serveur
    return this.valeurs.map(function(val){return val.format()});
  }
  Indice.prototype.affiche_recherche = function affiche_recherche(recherche) {
    //Détermine si un indice correspond à une recherche ou non
    var d = this.d;
    return d.continent.toLowerCase().indexOf(recherche.toLowerCase()) === 0 ||
           d.nom.toLowerCase().indexOf(recherche.toLowerCase()) >= 0 ||
           this.nouveau;
  };

  function Valeur(indice, data) {
    this.indice = indice;
    if (!data) data = Valeur.creer_donnees();
    this.d = data;
  }
  Valeur.creer_donnees = function () {
      return {
        periode:"",
        valeur: "",
        prevision: false,
        type: "moyenne",
        annuelle: true
      };
  };
  Valeur.prototype.valide = function () {
    return !isNaN(Date.parse(this.d.periode)) &&
           this.d.valeur !== "";
  };
  Valeur.prototype.format = function() {
    this.d.periode = (new Date(this.d.periode)).toISOString().slice(0,10);
    this.d.valeur  = parseFloat(this.d.valeur);
    this.d.id_indice = this.indice.d.id;
    this.d.annuelle = true;
    return this.d;
  }

  function requete (opts) {
    // Fait une requête au serveur et met à jour le statut de l'application
    // en fonction de la réponse
    var fun = (opts.data || opts.method === "POST") ? $http.post : $http.get;
    $scope.status = "⥀";
    return fun(opts.url, opts.data).then(function(res){
      $scope.status = "✓";
      if (opts.callback) return opts.callback(res);
    }, function() {
      $scope.status = "⚠";
    });
  }

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
