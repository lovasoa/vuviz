var vuvizAdmin = angular.module('vuvizAdmin', [
  'ngRoute',
  'AdminIndices',
  'AdminCommentaires'
]);

vuvizAdmin.config(function($routeProvider) {
    $routeProvider.
      when('/indices', {
        templateUrl: 'indices.html',
        controller: 'IndicesController'
      }).
      when('/commentaires', {
        templateUrl: 'commentaires.html',
        controller: 'CommentairesController'
      });
});
