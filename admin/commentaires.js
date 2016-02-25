var adminCom = angular.module('AdminCommentaires', []);
adminCom.controller('CommentairesController', function($scope, $http) {
  $scope.commentaires = [];
  $scope.indices = [];
  $scope.types = [];
  $scope.rechercheIndice = "";
  $http.get("../api/indices.php").then(function(res){
    $scope.indices = res.data;
  });
  $http.get("../api/commentaires.php").then(function(res){
    $scope.commentaires = res.data.commentaires;
    $scope.types = res.data.types;
  });

  $scope.switchIndice = function (liste, elem) {
    var idx = liste.indexOf(elem);
    if (idx === -1) liste.push(elem)
    else liste.splice(idx, 1);
  };
});

adminCom.filter('nomIndice', function(){
  return function(num, indices){
    var indice = indices.filter(function(i){return i.id === num})[0];
    return indice.continent + ' / ' + indice.nom;
  };
})
