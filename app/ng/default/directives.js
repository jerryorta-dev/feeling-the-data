define(['angular'], function(angular){

   angular.module('quiz.directives', []).
    directive('appVersion', ['version', function(version) {
      return function(scope, elm, attrs) {
        elm.text(version);
      };
    }]);



});