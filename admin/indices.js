var adminIndices = angular.module('AdminIndices', []);

adminIndices.controller('IndicesController', function($scope, $http) {
  function ListeIndices() {
    this.dernier_id = 0;
    this.liste = [];
    this.continents = [];
    this.index_nom = {}; //Associe les noms d'indice à leur valeur
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
  ListeIndices.prototype.rafraichir = function(duree) {
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
          url: "../api/valeurs.php?duree=" + duree,
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
    this.url_csv     = "#";
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
    requete({
      url  : indice.nouveau ? "api/creer_indice.php" : "api/maj_indice.php",
      data : indice.d,
      callback : function() {
        if (indice.nouveau) $scope.indices.nouvel_indice_vide();
        indice.disabled = indice.nouveau = false;
        requete({
          url: "api/maj_valeurs.php?id_indice=" + indice.d.id + "&duree=" + $scope.duree_prevision,
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
  Indice.prototype.csv = function () {
    //Retourne une chaine de caractères représentant les valeurs de l'indice au format csv
    return Valeur.entete_csv() + "\n" +
            this.valeurs.map(function(v){return v.csv()}).join('\n');
  };
  Indice.prototype.creer_csv = function () {
    var blob = new Blob([this.csv()], {type: "text/csv"});
    this.url_csv = URL.createObjectURL(blob);
  };
  Indice.prototype.import_csv = function(file) {
    var indice = this;
    var r = new FileReader;
    r.onload = function() {$scope.$apply(function(){
      var csv = r.result;
      var lines = csv.split('\n');
      if (lines[0] !== Valeur.entete_csv()) {
        alert("Fichier invalide.");
        return;
      }
      for (var i = 1, n = 0; i < lines.length; i++) {
        try {
          var val = Valeur.parse_csv(indice, lines[i]);
          indice.valeurs[n++] = val;
        } catch (e) {
          console.log("Valeur invalide dans le fichier CSV.", e);
        }
      }
      indice.valeurs.length = n;
    })};
    r.readAsText(file);
  }

  function Valeur(indice, data) {
    this.indice = indice;
    if (!data) this.d = Valeur.creer_donnees();
    else {
      this.d = data;
      this.format();
    }
  }
  Valeur.champs = [
    {
      "desc": "Date",
      "nom": "periode",
      "format": function(x) {
        var d = new Date(x);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0,10);
      }
    },
    {
      "desc": "Valeur",
      "nom": "valeur",
      "format": parseFloat
    },
    {
      "desc": "Type de valeur",
      "nom": "type"
    },
    {
      "desc": "Prévision",
      "nom": "prevision",
      "format": function(x) {return !{FAUX:1,FALSE:1,false:1,0:1}[x]}
    }
  ];
  Valeur.entete_csv = function() {
    return Valeur.champs.map(function (c){return c.desc}).join(',');
  };
  Valeur.parse_csv = function (indice, csv) {
    var data = csv.split(",").reduce(function(data, val, indice) {
      var col = Valeur.champs[indice];
      data[col.nom] = val;
      return data;
    }, {});
    return new Valeur(indice, data);
  };
  Valeur.creer_donnees = function () {
      return {
        periode:"",
        valeur: "",
        prevision: false,
        type: "moyenne",
        annuelle: $scope.annuelle()
      };
  };
  Valeur.prototype.valide = function () {
    return !isNaN(Date.parse(this.d.periode)) &&
           this.d.valeur !== "";
  };
  Valeur.prototype.format = function() {
    for (var i = 0; i < Valeur.champs.length; i++) {
      var col = Valeur.champs[i];
      if (col.format) this.d[col.nom] = col.format(this.d[col.nom]);
    }
    this.d.id_indice = this.indice.d.id;
    this.d.annuelle = $scope.annuelle();
    return this.d;
  };
  Valeur.prototype.csv = function () {
    this.format();
    var d = this.d;
    return Valeur.champs
              .map(function(c){return d[c.nom]})
              .join(',');
  };

  function requete (opts) {
    // Fait une requête au serveur et met à jour le statut de l'application
    // en fonction de la réponse
    var fun = (opts.data || opts.method === "POST") ? $http.post : $http.get;
    $scope.status = "…";
    return fun(opts.url, opts.data).then(function(res){
      $scope.status = "✓";
      if (opts.callback) return opts.callback(res);
    }, function() {
      $scope.status = "⚠";
    });
  }

  $scope.Valeur = Valeur;
  $scope.status = "✓";
  $scope.indices = new ListeIndices;
  $scope.recherche = "";
  $scope.valeurs = [];
  $scope.durees_possibles = ["annuelle", "trimestrielle"];
  $scope.duree_prevision = "annuelle";
  $scope.annuelle = function() {
    return $scope.duree_prevision === "annuelle";
  };
  $scope.$watch("duree_prevision", function (nouvelle_duree, ancienne_duree) {
    $scope.indices.rafraichir(nouvelle_duree);
  });
});

adminIndices.filter("cherche", function($filter){
  return function (indices, recherche){
    return $filter("filter")(indices, function correspond(indice) {
      return indice.affiche_recherche(recherche);
    });
  };
});

adminIndices.config(['$compileProvider', function($compileProvider){
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob):/);
}]);
