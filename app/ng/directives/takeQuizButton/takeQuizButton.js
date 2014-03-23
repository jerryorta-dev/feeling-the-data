define(['angular', "quizDirectives"], function (angular) {


  //Using bootstrap for theming
//  require(['css!./ng/directives/quizRouteButton/quizRouteButton.css']);

  angular.module('quiz.directives')

    .controller('TakeQuizController',
                  ['$scope', '$element', '$attrs', '$transclude', '$state', 'Restangular', 'ScoreCard',
          function ($scope,   $element,   $attrs,   $transclude,   $state,   Restangular,   ScoreCard) {

      $scope.params = {time: '30', maxQuestions: '20'};
      $scope.takeQuiz = function (quiz, params) {

        Restangular.all(quiz.directory + '/package').getList().then(function (result) {
          ScoreCard.addQuiz(quiz, params, result).then(function (result) {
            $state.go('quiz.questions', {
              location: true,
              reload: true
            });
          })

        }, function (error) {
          console.log(error)
        })
      }
    }])
    .directive('takeQuizButton', function () {
      return {
        restrict: 'AE',
        replace: false,
        require: ['NgModelController', 'ConfigureController'],
        scope: {
          url: '@routeUrl',
          quiz: '=quiz',
          params: '=params',
          buttonValue: '@label'
        },
        controller: 'TakeQuizController',
        templateUrl: 'app/ng/directives/takeQuizButton/takeQuizButton.html'
      }
    });
});

