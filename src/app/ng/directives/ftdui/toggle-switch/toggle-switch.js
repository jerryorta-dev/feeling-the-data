angular.module('ftdui.toggleswitch', [])

    .directive('ftdUiToggleswitch', function () {

        return {
            restrict: 'AE',
            replace: false,
            scope: {
                bgClass: '@bgClass',
                btnClass: '@btnClass',
                btnOn: '@btnOn',
                btnOff: '@btnOff',
                btnGlyph: '@btnGlyph',
                name: '@name'
            },
            controller: ['$scope', '$element', '$attrs', '$transclude', 'UIControls', function ($scope, $element, $attrs, $transclude, UIControls) {

                $scope.toggle = true;
                $scope.btnLabel = ($scope.toggle == true ) ? $scope.btnOn : $scope.btnOff;


                UIControls.set($scope.name, true);


                $scope.$watch(function () {
//                    $scope.buttonWidth = $('button', $element).outerWidth();
//                    $scope.elementWidth = $element.context.children[0].clientWidth;
                });


                $scope.toggleBtn = function () {
                    $scope.toggle = !$scope.toggle;
                    $scope.btnLabel = ($scope.toggle == true ) ? $scope.btnOn : $scope.btnOff;

                    var endAnimation;
                    if (!$scope.toggle) { //is on
                        endAnimation = $scope.elementWidth - $scope.buttonWidth;

                    } else { //is off
                        endAnimation = 0;
                    }

                    UIControls.update($scope.name, $scope.toggle);
                    TweenMax.to($('button', $element), .25, {left: endAnimation, ease: "Circ.easeOut"});

                }

            }],
            templateUrl: 'app/ng/directives/ftdui/toggle-switch/toggle-switch.html'
        }
    });