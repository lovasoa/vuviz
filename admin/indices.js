var app = angular.module('vuvizApp', []);

app.controller('IndicesController', function($scope, $http) {
  $scope.status = "✓";
  $scope.indices = [];
  $scope.continents = [];
  var dernier_id = 0;

  function nouvel_indice() {
    return {
      id: ++dernier_id,
      nouveau: true,
      nom: "",
      couleur: "#8800aa",
      sectoriel: false,
      continent: "Europe"
    };
  };

  $http.get("../api/indices.php").then(function(res){
    for(var i=0; i<res.data.length; i++) {
      var indice = res.data[i];
      $scope.indices.push(indice);
      if (!~$scope.continents.indexOf(indice.continent))
        $scope.continents.push(indice.continent);
      if (dernier_id < indice.id) dernier_id = indice.id;
    }
    $scope.indices.push(nouvel_indice());
  });

  $scope.postIndice = function creerIndice(indice) {
    // Met à jour la base de données avec un indice modifié
    var url = indice.nouveau ? "api/creer_indice.php" : "api/maj_indice.php";
    $http.post(url, indice).then(function(){
      $scope.status = "✓";
      if (indice.nouveau) $scope.indices.push(nouvel_indice());
      indice.disabled = indice.nouveau = false;
    }, function() {
      $scope.status = "⚠";
    });
    $scope.status = "⥀";
    indice.disabled = true;
  };

  $scope.supprIndice = function supprIndice(indice) {
    // Supprime un indice de la base de données
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
