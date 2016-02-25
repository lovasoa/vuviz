var adminCom = angular.module('AdminCommentaires', []);
adminCom.controller('CommentairesController', function($scope, $filter, $http) {
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

  $scope.supprType = function(type) {
    for (var i = 0; i < $scope.commentaires.length; i++) {
      var com = $scope.commentaires[i];
      if (com.type === type.id) {
        alert("Vous ne pouvez pas supprimer le type «" +
              type.description +
              "» car le commentaire «" +
              $filter("couper")(com.texte, 50) +
              "» l'utilise.");
        return;
      };
    }
    $scope.types = $scope.types.filter(function(t){return t!==type});
  };

  $scope.nouveauType = function () {
    $scope.types.push({
      "icone": "",
      "description": "",
      "couleur": "#123456",
      "id" : $scope.types.reduce(function(m,i){return i.id>m?i.id:m}, 0)+1
    });
  };
});

adminCom.filter('nomIndice', function(){
  return function(num, indices){
    var indice = indices.filter(function(i){return i.id === num})[0];
    return indice.continent + ' / ' + indice.nom;
  };
});

adminCom.filter('couper', function(){
  // Coupe une chaîne de caractères après n caractères, ajoutant des points
  // de suspension si la chaîne a été coupée
  return function(texte, n){
    // Essaye de couper après un mot
    var res = "", splitted = texte.split(' ');
    for(var i=0; i<splitted.length; i++) {
      if (res.length + splitted[i].length > n) break;
      res += splitted[i] + ' ';
    }
    if (res.length === 0)
      res = texte.slice(0, n-1);
    return res + (res.length < texte.length ? '…' : '');
  };
})
