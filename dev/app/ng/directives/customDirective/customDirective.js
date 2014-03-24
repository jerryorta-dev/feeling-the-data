define(['angular', 'preprocess'], function (angular, p) {
    p.log('customDirective')

    angular.module('app.directivesModule')
        .directive('customDirective', function () {
            return {
//                require: '^AnswerController',
                restrict: 'AE',
                replace: false,
                scope: {
                    buttonValue: '@label'
                },
                controller: ['$scope', '$element', '$attrs', '$transclude',  function ($scope, $element, $attrs, $transclude) {



                }],
                templateUrl: 'app/ng/directives/customDirective/customDirective.html'
            }
        });
});
