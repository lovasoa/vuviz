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
    $http.post("api/maj_indice.php", indice).then(function(){
      $scope.status = "✓";
      indice.disabled = false;
    }, function() {
      $scope.status = "⚠";
    });
    $scope.status = "⥀";
    indice.disabled = true;
  };

  $scope.supprIndice = function supprIndice(indice) {
    // Supprime un indice de la base de données
    var msg = "Êtes-vous sûr de vouloir supprimer l'indice «"+indice.nom+"» ?";
    if (!confirm(msg)) return;
    $http.post("api/suppr_indice.php", indice).then(function(){
      $scope.status = "✓";
      $scope.indices = $scope.indices.filter(function(i){return i !== indice});
    }, function() {
      $scope.status = "⚠";
    });
    indice.disabled = true;
    $scope.status = "⥀";
  };
});
