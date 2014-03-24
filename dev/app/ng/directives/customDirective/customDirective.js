define(['angular', 'preprocess'], function (angular, p) {
    p.loadOrder('customDirective')

    angular.module('app.directivesModule')
        .directive('customDirective', function () {
            p.loadOrder('customDirective directive');
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

