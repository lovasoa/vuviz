var app = angular.module('vuvizApp', ["nvd3"]);

//CONTROLLEUR
app.controller('VuvizController', function($scope, $filter, $http) {
    var control = this;
    $scope.nomApplication = "Prévision Financière et Boursière";
	//données sur la liste des indices
    $scope.indices = [];
    //données sur les continents
    $scope.liste_continents = [];
    // Commentaires sur l'évolution des valeurs
    $scope.commentaires = [];
    $http.get("api/indices.php").then(function(res){
      // Téléchargement des indices depuis l'API
      $scope.indices = res.data.map(function(indice){
        indice.selected = false;
        return indice;
      });
      $scope.liste_continents = res.data.reduce(function(continents, indice){
        if (continents.indexOf(indice.continent) === -1)
          continents.push(indice.continent);
        return continents;
      }, []);

       // Récupération des commentaires sur les indices
       $http.get("api/commentaires.php").then(function(res){
         $scope.commentaires = res.data.commentaires;
         angular.forEach($scope.commentaires, function (com) {
           com.type = res.data.types[com.type];
           com.indices = $scope.indices.filter(function(indice){
             return ~com.indices.indexOf(indice.id);
           });
         });
       });
    });

	//INITIALISATION
	//initialisation des filtres
    $scope.filtre = {
      "continent" : "États-Unis",
      "sectoriel" : false
    };
	//initialisation du type de prévision (annuelle/trimestrielle)
    $scope.durees_possibles = ["annuelle", "trimestrielle"]
    $scope.duree_prevision = "annuelle";
  // Récupération des bonnes valeurs lorsque la durée de prévision change
    function recup_valeurs (duree) {
      $http.get("api/valeurs.php?duree="+duree).then(function res_valeurs(res) {
        $scope.historiqueValeurs = res.data.map(function(val) {
          val.periode = (new Date(val.periode)).getTime();
          return val;
        });
      });
    }
    $scope.$watch("duree_prevision", function (nouvelle_duree, ancienne_duree) {
      recup_valeurs(nouvelle_duree);
      // Vérification que la durée soit bien toujours "annuelle" ou "trimestrielle"
      return ~$scope.durees_possibles.indexOf(nouvelle_duree) ? nouvelle_duree : ancienne_duree;
    });
    // Récupération des valeurs initiales
    recup_valeurs($scope.duree_prevision);

	//filtre
    $scope.selected = {selected: true};

	//donnée sur la valeur des indices
  	$scope.historiqueValeurs = [];

	//données pour le selecteur de date du graphique historique évolution
    $scope.duree_graph = {
      selectionne: {valeur:5, label: "5 jour"},
      valeurs_possibles: [
        {valeur:5, label: "5 jours"},
        {valeur:30, label: "1 mois"},
        {valeur:30*3, label: "3 mois"},
        {valeur:30*6, label: "6 mois"},
        {valeur:365, label: "1 an"}
      ]
    };
    $scope.valeurs_ui = {dates: [], indices: []};

	//FONCTIONS
  $scope.updateValeursUI = function updateValeursUI() {
    $scope.valeurs_ui = $filter("selectedValues")(
                                    $scope.historiqueValeurs,
                                    $scope.indices,
                                    $scope.duree_prevision);
  };
  $scope.$watchGroup(["historiqueValeurs", "indices", "duree_prevision"], $scope.updateValeursUI);

	//fonction qui déselectionne tous les indices selectionné
	$scope.deselectionnerIndices = function() {
    angular.forEach($scope.indices, function(indice) {
      indice.selected = false;
    });
  };
	//fonction pour faire agir les case a coché comme boutons radio
  $scope.changementIndice = function(indice) {
      if($scope.duree_prevision === 'trimestrielle') {
        $scope.deselectionnerIndices();
        indice.selected = true;
      }
      $scope.updateValeursUI();
  };

  $scope.histoActuel = function() {
    //Retourne un tableau des valeurs d'historiques pour l'indice actuellement
    //sélectionné et la période sélectionnée
    return $filter('filter')(
      $scope.historiqueValeurs,
      function(el){
        var indices = $filter('filter')($scope.indices, {nom: el.indice});
        return indices.length === 1 && indices[0].selected;
      });
  };

  $scope.graphOptions = memoize(function(type, histoActuel) {
    var ret= {
        "chart": {
           "type": 'lineChart',
           "height": 450,
           "xAxis" : {
             "axisLabel" : "période",
             "showMaxMin" : false,
             "tickValues" : (function tickValues() {
               if (type !== "evolution") return null;
               return histoActuel.map(function (h) {return h.periode});
             })(),
             "tickFormat" : function(x) {
               //Formatage des dates
               return $filter("printPeriode")(x, $scope.duree_prevision==="annuelle");
             }
           }
        }
      };
      return ret;
  });

  //pour afficher les axis en heure (pas encore utilisé)
  $scope.xAxisTickFormatFunction = function(){
    return function(d) {
      return d3.time.format('%H:%M')(new Date(d));
    };
  }


});

//FILTRES

app.filter('valeursIndices', function() {
  // Filtre qui prend en entrée un tableau d'indices et sort un tableau de
  // valeurs d'indices compatible avec nvd3
  var _cache = [];
  return function(indices) {
    _cache.length = indices.length;
    for(var j=0; j<indices.length; j++) {
      var i = indices[j];
      _cache[j] = {
        values : [{x:0,y:i.nom.charCodeAt(0)}, {x:1,y:i.nom.charCodeAt(1)}, {x:2,y:80}],
        key: i.nom,
        color: i.color
      }
    }
    return _cache;
  };
});

app.filter('valeursIndicesEvolution', function($filter) {
  // Filtre qui prend en entrée un tableau d'indices et sort un tableau de
  // valeurs d'indices compatible avec nvd3
  var couleurType = {"max": "#4efe4e", "min":"#fe4e4e"};
  var _cache = [];
  return function(valeurs) {
    var n = 0;
    for(var i=0; i<valeurs.indices.length; i++) {
      var indice = valeurs.indices[i];
      for (var j = 0; j < indice.histos.length; j++) {
        var histo = indice.histos[j];
        var values = [];
        for (var k = 0; k < histo.valeurs.length; k++) {
          if (histo.valeurs[k] != null)
            values.push({y: histo.valeurs[k], x:valeurs.dates[k].value});
        }
        _cache[n++] = {
          values : values,
          key: indice.nom + ' (' + histo.type + ')',
          color: couleurType[histo.type] || indice.couleur
        };
      }
    }
    _cache.length = n;
    return _cache;
  };
});

app.filter('valeursIndices3', function() {
  // Filtre qui prend en entrée un tableau d'indices et sort un tableau de
  // valeurs d'indices compatible avec nvd3
  var _cache = [];
  return function(indices) {
    _cache.length = indices.length;
    for(var j=0; j<indices.length; j++) {
      var i = indices[j];
      _cache[j] = {
        values : [
			{x:08,y:1000+i.nom.charCodeAt(2)},
			{x:09,y:1140+i.nom.charCodeAt(3)},
			{x:10,y:1240+i.nom.charCodeAt(4)},
			{x:11,y:1340+i.nom.charCodeAt(5)},
			{x:12,y:1440+i.nom.charCodeAt(3)},
			{x:13,y:1540+i.nom.charCodeAt(0)},
			{x:14,y:1540+i.nom.charCodeAt(1)},
			{x:15,y:1640+i.nom.charCodeAt(2)},
			{x:16,y:1740+i.nom.charCodeAt(3)},
			{x:17,y:1840+i.nom.charCodeAt(4)},
			{x:18,y:1940+i.nom.charCodeAt(5)},
		],
        key: i.nom,
        color: i.color
      }
    }
    return _cache;
  };
});

//pour faire un filtre unique dans un ng-repeat
app.filter('unique', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});

app.filter("formatNum", function(){
  return function (nombre, decimales, separateurMilliers, separateurDecimales){
    decimales = decimales || 0;
    separateurMilliers = separateurMilliers || "\u00a0"; //unbreakable space
    separateurDecimales = separateurDecimales || ",";
    if (isNaN(nombre)) return "";
    nombre = parseFloat(nombre);
    var s = "";
    for(var i=0, nbr = nombre|0; nbr > 0; i++) {
      if (i>0 && i%3==0 && i) s = separateurMilliers + s;
      s = (nbr % 10) + s;
      nbr = nbr / 10 | 0;
    }
    if (decimales > 0) s += separateurDecimales;
    for (var i=0, nbr = nombre; i<decimales; i++) {
      nbr *= 10;
      s += (nbr|0) % 10;
    }
    return s;
  };
});

app.filter("printPeriode", function(){
  return function (periode, anneeSeulement){
    var d = new Date(periode);
    var annee = d.getFullYear();
    var trimestre = Math.floor(d.getMonth() / 4) + 1;
    return annee + (anneeSeulement ? "" : (" T" + trimestre));
  };
});

app.filter("selectedValues", function($filter){
  // Crée un tableau avec les valeurs des indices sélectionnés de la forme:
  /*
  {
  "dates" : [
    {value: 2012, nom:"2012", prevision: false},
    {value: 2013, nom:"2013", prevision: false},
    {value: 2016, nom:"2016", prevision: true},
  ],

  "indices" : [{
    nom: "DOW JONES",
    histos: [
      {"type": "min", valeurs: [105, 201, 155]},
      {"type": "max", valeurs: [109, 291, 182]},
      {"type": "moyenne", valeurs: [106, 210, 160]},
    ]
  }],
  }
  */
  function findPropInArray(array, property, value) {
      for(var i=0; i<array.length; i++) {
        if (array[i][property] === value) return i;
      }
      return -1;
  }

  return function(valeurs, indices, type) {
    var nomsIndices = $filter("filter")(indices, {selected:true}, true).map(function(i){return i.nom});
    var couleurs = indices.reduce(function(p, c){
      p[c.nom] = c.couleur;
      return p;
    }, {});
    var res = {"dates" : [], "indices":[]};
    res.dates = valeurs.reduce(function(prev, cur){
      if (~nomsIndices.indexOf(cur.indice)) {
        var i = findPropInArray(prev, "value", cur.periode);
        if (i === -1) {
          i = -1 + prev.push({
            value : cur.periode,
            nom: $filter("printPeriode")(cur.periode, type === "annuelle"),
            prevision: cur.prevision
          });
        }
        prev[i].prevision = prev[i].prevision || cur.prevision;
      }
      return prev;
    }, []).sort(function(a,b){return a.value - b.value});

    res.indices = valeurs.reduce(function(prev, cur) {
      if (~nomsIndices.indexOf(cur.indice)) {
        var i = findPropInArray(prev, "nom", cur.indice);
        if (i === -1) {
          i = prev.length;
          prev.push({
            "nom": cur.indice,
            "histos": []
          });
        }
        var j = findPropInArray(prev[i].histos, "type", cur.type);
        if (j === -1) {
          j = prev[i].histos.length;
          prev[i].histos.push({
            "couleur": cur.couleur,
            "type": cur.type,
            "valeurs": new Array(res.dates.length)
          });
        }
        var k = findPropInArray(res.dates, "value", cur.periode);
        prev[i].histos[j].valeurs[k] = cur.valeur;
      }
      return prev;
    }, []);
    return res;
  };
});

app.filter("selectionne", function(){
  return function selectionne (indices) {
    return indices.reduce(function (selectionne, indice){
      return selectionne || indice.selected;
    }, false);
  };
});

function memoize(f) {
  var dict = {};
  return function() {
    var args = JSON.stringify(arguments);
    if(dict.hasOwnProperty(args)) return dict[args];
    var res = f.apply(null, arguments);
    dict[args] = res;
    return res;
  }
}
