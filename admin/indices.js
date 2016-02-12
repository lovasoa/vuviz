var app = angular.module('vuvizApp', []);

app.controller('IndicesController', function($scope, $http) {
  $scope.status = "✓";
  $scope.indices = [];
  $scope.continents = [];
  $http.get("../api/indices.php").then(function(res){
    $scope.indices = res.data;
    $scope.continents = res.data.reduce(function(continents, indice){
      if (!~continents.indexOf(indice.continent)) continents.push(indice.continent);
      return continents;
    }, []);
  });

  $scope.postIndice = function postIndice(indice) {
    // Met à jour la base de données avec un indice modifié
    $scope.status = "⥀";
    $http.post("api/maj_indice.php", indice).then(function(){
      $scope.status = "✓";
    }, function() {
      $scope.status = "⚠";
    });
  };
});
