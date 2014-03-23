define(['angular', "quizDirectives"], function (angular) {


    //Using bootstrap for theming
//  require(['css!./ng/directives/quizRouteButton/quizRouteButton.css']);


  angular.module('quiz.directives')
    .directive('quizRouteButton', function () {
      return {
        restrict: 'AE',
        replace: false,
        scope: {
          url: '@routeUrl',
          buttonValue: '@label'
        },
        templateUrl: 'app/ng/directives/quizRouteButton/quizRouteButton.html'
      }
    });
});

