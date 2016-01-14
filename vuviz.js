var app = angular.module('vuvizApp', ["nvd3"]);

//CONTROLLEUR
app.controller('VuvizController', function($scope, $filter) {
    var control = this;
    $scope.nomApplication = "Prévision Financière et Boursière";
	//données sur la liste des indices
    $scope.indices = [
		//Etat Unis
      {nom:'DOW JONES', continent:'État-Unis', sectoriel:false, selected: false, color:"#071BA3"},
      {nom:'NASDAQ', continent:'État-Unis', sectoriel:false, selected:false, color:"#145EDE"},
      {nom:'S&P500', continent:'État-Unis', sectoriel:false, selected:false, color:"#96B7E3"},
	  //europe
      {nom:'DAX', continent:'Europe', sectoriel:false, selected:false, color:"#071BA3"},
      {nom:'FOOTSIE', continent:'Europe', sectoriel:false, selected:false, color:"#145EDE"},
      {nom:'CAC40', continent:'Europe', sectoriel:false, selected:false, color:"#96B7E3"},
      {nom:'IBEX', continent:'Europe', sectoriel:false, selected:false, color:"#D313E8"},
      {nom:'MIB', continent:'Europe', sectoriel:false, selected:false, color:"#F7812D"},
      {nom:'Euro Stoxx50', continent:'Europe', sectoriel:false, selected:false, color:"#505D61"},
	  //ASIE
      {nom:'NIKKEI250', continent:'Asie', sectoriel:false, selected:false, color:"#071BA3"},
      {nom:'SSE', continent:'Asie', sectoriel:false, selected:false, color:"#145EDE"},
      {nom:'HS', continent:'Asie', sectoriel:false, selected:false, color:"#96B7E3"},

      //SECTORIEL
      {nom:'Indice sectoriel performant', continent:'Asie', sectoriel:true, selected:false, color:"#96B7E3"},
      {nom:'Indice sectoriel moins performant', continent:'Asie', sectoriel:true, selected:false, color:"#96B7E3"},
      {nom:'Indice sectoriel performant', continent:'Europe', sectoriel:true, selected:false, color:"#96B7E3"},
      {nom:'Indice sectoriel moins performant', continent:'Europe', sectoriel:true, selected:false, color:"#96B7E3"},
      {nom:'Indice sectoriel performant', continent:'État-Unis', sectoriel:true, selected:false, color:"#96B7E3"},
      {nom:'Indice sectoriel moins performant', continent:'État-Unis', sectoriel:true, selected:false, color:"#96B7E3"}

    ];
	//données sur les continents
    $scope.liste_continents = ["État-Unis", "Europe", "Asie"];

	//INITIALISATION
	//initialisation des filtres
    $scope.filtre = {
      "continent" : "État-Unis",
      "sectoriel" : false
    };
	//initialisation du type de prévision (annuelle/trimestrielle)
    $scope.duree_prevision = "annuelle";
	//filtre
    $scope.selected = {selected: true};

	//donnée sur la valeur des indices
  	$scope.historiqueValeurs = {
      "annuelle" : [
      	{periode:2012, indice:"DOW JONES", value:12965},
      	{periode:2013, indice:"DOW JONES", value:15010},
      	{periode:2014, indice:"DOW JONES", value:16778},
      	{periode:2015, indice:"DOW JONES", value:16010},
      	{periode:2016, indice:"DOW JONES", value:16500, prevision: true},
      	{periode:2017, indice:"DOW JONES", value:17000, prevision: true},
      	{periode:2012, indice:"NASDAQ", value:2966},
      	{periode:2013, indice:"NASDAQ", value:3541},
      	{periode:2014, indice:"NASDAQ", value:4375},
      	{periode:2015, indice:"NASDAQ", value:4000},
      	{periode:2016, indice:"NASDAQ", value:5000, prevision: true},
      	{periode:2017, indice:"NASDAQ", value:6000, prevision: true},
      	{periode:2012, indice:"S&P500", value:1379},
      	{periode:2013, indice:"S&P500", value:1644},
      	{periode:2014, indice:"S&P500", value:1931},
      	{periode:2015, indice:"S&P500", value:2000},
      	{periode:2016, indice:"S&P500", value:2500, prevision: true},
      	{periode:2017, indice:"S&P500", value:3000, prevision: true}
    	],
      "trimestrielle": [
        {periode:"T4-2014", indice:"DOW JONES", value:4375},
      	{periode:"T1-2015", indice:"DOW JONES", value:4000},
      	{periode:"T2-2015", indice:"DOW JONES", value:3954},
      	{periode:"T3-2015", indice:"DOW JONES", value:4045},
      	{periode:"T4-2015", indice:"DOW JONES", value:5000, prevision: true},
      	{periode:"T1-2016", indice:"DOW JONES", value:5500, prevision: true}
      ]
  };
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

	//FONCTIONS

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
  };

  //fonction qui récupere la valeur d'un indice en fonction de son nom
  // et de son année ou son trimestre
  $scope.trouveValeurIndice = function (tab, nomIndice, periode) {
	  //on utilise la fonction filtre appelé filter
    var vals = $filter('filter')(tab, {indice:nomIndice, periode:periode});
    if(vals.length !== 1) {
      console.error("Impossible de trouver la valeur de l'indice " +
                        nomIndice + " pour la période " + periode + ". " +
                        "Valeurs trouvées: " + JSON.stringify(vals));
      return; // Retourne undefined
    }
    return vals[0].value;
  };


	//PARAMETRES GRAPHIQUES
    $scope.graph1 = {
      "options" : {
        chart: {
           type: 'lineChart',
           height: 450,
        }
      }
    };

	$scope.graph2 = {
      "options" : {
        chart: {
           type: 'lineChart',
           height: 450,
           xAxis : {
             "axisLabel" : "période",
             "tickFormat" : function(x) {
               //Formatage des dates
               return $filter("printPeriode")(x);
             }
           }
        }
      }
    };

	$scope.graph3 = {
      "options" : {
        chart: {
           type: 'lineChart',
           height: 250,
        }
      }
    };
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

app.filter('valeursIndices2', function($filter) {
  // Filtre qui prend en entrée un tableau d'indices et sort un tableau de
  // valeurs d'indices compatible avec nvd3
  function parsePeriode(periode) {
    //Retourne un nombre à partir d'une période, qui peut être soir une année,
    //soit une chaine de caractères de la forme "T1-2015"
    if (typeof(periode) === "number") return periode;
    return parseInt(periode.split('-')[1]) +
           (parseInt(periode[1]) - 1) / 4;
  }

  var _cache = [];
  return function(indices, valeurs) {
    _cache.length = indices.length;
    for(var j=0; j<indices.length; j++) {
      var i = indices[j];
      _cache[j] = {
        values : $filter('filter')
                    (valeurs, {"indice":i.nom})
                     .map(function(histo){
                       return {x: parsePeriode(histo.periode), y:histo.value};
                     }),
        key: i.nom,
        color: i.color
      }
    }
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
    if (isNaN(nombre)) {
      return console.warn("Nombre invalide: ", nombre);
    }
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
  return function (periode){
    var annee = parseInt(periode);
    var trimestre = parseInt((periode-annee)*4) + 1;
    return annee + " T" + trimestre;
  };
});
