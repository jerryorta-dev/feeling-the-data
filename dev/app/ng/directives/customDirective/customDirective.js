define(['angular', 'app'], function (angular, app) {
    app.loadOrder('customDirective')

    angular.module('ftd.directivesModule')
        .directive('customDirective', function () {
            app.loadOrder('customDirective directive');
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

