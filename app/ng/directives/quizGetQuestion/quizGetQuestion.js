define(['angular', "quizDirectives"], function (angular) {

    require(['css!./ng/directives/quizGetQuestion/quizGetQuestion.css']);
    angular.module('quiz.directives')
        .directive('quizGetQuestion', function () {
            return {
                require: '^AnswerController',
                restrict: 'AE',
                replace: false,
                scope: {
                    requestQuestion: '@iterate',
                    buttonValue: '@label'
                },
                controller: ['$scope', '$element', '$attrs', '$transclude', 'quizScoreProvider', function ($scope, $element, $attrs, $transclude, quizScoreProvider) {


                    quizScoreProvider.then(function (engObj) {
                        $scope.quizEngine = engObj;

                    });
                    $scope.getQuestion = function () {
                        $scope.quizEngine.getQuestion($scope.requestQuestion);
                    };


                }],
                templateUrl: 'app/ng/directives/quizGetQuestion/quizGetQuestion.html'
            }
        });
});

