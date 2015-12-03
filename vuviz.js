var app = angular.module('vuvizApp', ["nvd3"]);

app.controller('VuvizController', function($scope, $filter) {
    var control = this;
    $scope.nomApplication = "Prévision Financière et Boursière";
    $scope.indices = [
		//Etat Unis
      {nom:'DOW JONES', continent:'État-Unis', sectoriel:false, selected: false},
      {nom:'NASDAQ', continent:'État-Unis', sectoriel:false, selected:false},
      {nom:'S&P500', continent:'État-Unis', sectoriel:false, selected:false},
	  //europe
      {nom:'DAX', continent:'Europe', sectoriel:false, selected:false},
      {nom:'FOOTSIE', continent:'Europe', sectoriel:false, selected:false},
      {nom:'CAC40', continent:'Europe', sectoriel:false, selected:false},
      {nom:'IBEX', continent:'Europe', sectoriel:false, selected:false},
      {nom:'MIB', continent:'Europe', sectoriel:false, selected:false},
      {nom:'IBEX', continent:'Europe', sectoriel:false, selected:false},
	  //ASIE
      {nom:'NIKKEI250', continent:'Asie', sectoriel:false, selected:false},
      {nom:'SSE', continent:'Asie', sectoriel:false, selected:false},
      {nom:'HS', continent:'Asie', sectoriel:false, selected:false}];

    $scope.liste_continents = ["État-Unis", "Europe", "Asie"];

    $scope.filtre = {
      "continent" : "État-Unis",
      "sectoriel" : false
    };

    $scope.selected = {selected: true};
	$scope.tableau=[
  	{annee:2012, indice:"DOW JONES", value:12965},
  	{annee:2013, indice:"DOW JONES", value:15010},
  	{annee:2014, indice:"DOW JONES", value:16778},
  	{annee:2015, indice:"DOW JONES", value:16010},
  	{annee:2016, indice:"DOW JONES", value:16500},
  	{annee:2017, indice:"DOW JONES", value:17000},
  	{annee:2012, indice:"NASDAQ", value:2966},
  	{annee:2013, indice:"NASDAQ", value:3541},
  	{annee:2014, indice:"NASDAQ", value:4375},
  	{annee:2015, indice:"NASDAQ", value:4000},
  	{annee:2016, indice:"NASDAQ", value:5000},
  	{annee:2017, indice:"NASDAQ", value:6000},
  	{annee:2012, indice:"S&P500", value:1379},
  	{annee:2013, indice:"S&P500", value:1644},
  	{annee:2014, indice:"S&P500", value:1931},
  	{annee:2015, indice:"S&P500", value:2000},
  	{annee:2016, indice:"S&P500", value:2500},
  	{annee:2017, indice:"S&P500", value:3000}
	];

  $scope.trouveValeurIndice = function (nomIndice, annee) {
    var vals = $filter('filter')($scope.tableau, {indice:nomIndice, annee:annee});
    if(vals.length !== 1) {
      console.error("Impossible de trouver la valeur de l'indice " +
                        nomIndice + " pour l'annee " + annee + ". " +
                        "Valeurs trouvées: " + JSON.stringify(vals));
      return; // Retourne undefined
    }
    return vals[0].value;
  };



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
        }
      }
    };
});

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
        color: "#00"+i.nom.charCodeAt(0)+i.nom.charCodeAt(1)
      }
    }
    return _cache;
  };
});

app.filter('valeursIndices2', function() {
  // Filtre qui prend en entrée un tableau d'indices et sort un tableau de
  // valeurs d'indices compatible avec nvd3
  var _cache = [];
  return function(indices) {
    _cache.length = indices.length;
    for(var j=0; j<indices.length; j++) {
      var i = indices[j];
      _cache[j] = {
        values : [
			{x:2005,y:840+i.nom.charCodeAt(0)},
			{x:2006,y:931+i.nom.charCodeAt(1)},
			{x:2007,y:1000+i.nom.charCodeAt(2)},
			{x:2008,y:1140+i.nom.charCodeAt(3)},
			{x:2009,y:1240+i.nom.charCodeAt(4)},
			{x:2010,y:1340+i.nom.charCodeAt(5)},
			{x:2011,y:1440+i.nom.charCodeAt(3)},
			{x:2012,y:1540+i.nom.charCodeAt(0)},
			{x:2013,y:1540+i.nom.charCodeAt(1)},
			{x:2014,y:1640+i.nom.charCodeAt(2)},
			{x:2015,y:1740+i.nom.charCodeAt(3)},
			{x:2016,y:1840+i.nom.charCodeAt(4)},
			{x:2017,y:1940+i.nom.charCodeAt(5)},


		],
        key: i.nom,
        color: "#00"+i.nom.charCodeAt(0)+i.nom.charCodeAt(1)
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
