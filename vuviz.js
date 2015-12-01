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
      "continent" : "Europe",
      "sectoriel" : false
    };

    $scope.selected = {selected: true};

    $scope.graph1 = {
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
