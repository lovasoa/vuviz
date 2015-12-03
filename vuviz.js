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
	{annee:"2012", indice:"DOW JONES", value:"12 965"},
	{annee:"2013", indice:"DOW JONES", value:"15 010"},
	{annee:"2014", indice:"DOW JONES", value:"16 778"},
	{annee:"2015", indice:"DOW JONES", value:"16 010"},
	{annee:"2016", indice:"DOW JONES", value:"16 500"},
	{annee:"2017", indice:"DOW JONES", value:"17 000"},
	{annee:"2012", indice:"NASDAQ", value:"2 966"},
	{annee:"2013", indice:"NASDAQ", value:"3 541"},
	{annee:"2014", indice:"NASDAQ", value:"4 375"},
	{annee:"2015", indice:"NASDAQ", value:"4 000"},
	{annee:"2016", indice:"NASDAQ", value:"5 000"},
	{annee:"2017", indice:"NASDAQ", value:"6 000"},
	{annee:"2012", indice:"S&P500", value:"1 379"},
	{annee:"2013", indice:"S&P500", value:"1 644"},
	{annee:"2014", indice:"S&P500", value:"1 931"},
	{annee:"2015", indice:"S&P500", value:"2 000"},
	{annee:"2016", indice:"S&P500", value:"2 500"},
	{annee:"2017", indice:"S&P500", value:"3 000"},

	];




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
