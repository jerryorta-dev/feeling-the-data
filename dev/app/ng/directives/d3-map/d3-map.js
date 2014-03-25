define(['angular', 'preprocess', 'd3'], function (angular, p, d3) {
    p.loadOrder('d3-map directive');
    p.log("d3 version: " + d3.version);

    angular.module('app.directivesModule')
        .directive('worldMap', function () {
            p.loadOrder('customDirective directive');
            return {
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

