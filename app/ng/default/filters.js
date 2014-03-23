define(['angular'], function(angular){
  angular.module('quiz.filters', []).
    filter('interpolate', ['version', function(version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      }
    }]);

});