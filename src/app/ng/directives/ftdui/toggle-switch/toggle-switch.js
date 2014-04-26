angular.module('ftd.ui.toggleswitch', [])

/**
 * <ftd-ui-toggleswitch></ftd-ui-toggleswitch>
 */
    .directive('ftdUiToggleswitch', ['ftd.ui.pubsub', function (ps) {

        return {
            restrict: 'AE',
            replace: false,
            scope: {
                bgClass: '@bgClass',
                btnClass: '@btnClass',
                btnOn: '@btnOn',
                btnOff: '@btnOff',
                btnGlyph: '@btnGlyph',
                name: '@name',
                publishTypes:'@publishTypes'
            },
            link: function ($scope, $element, $attrs, $transclude) {

                /**
                 * Publish toggle states to data sets
                 */
                var publisher = ps.makePublisher($scope.name, true, {types: $scope.publishTypes});

                /**
                 * TODO should this be a thenable to resemble a promise? Be consistent?
                 */
//                publisher.status(function(result) {
//
//                });


                $scope.toggle = true;
                $scope.btnLabel = ($scope.toggle == true ) ? $scope.btnOn : $scope.btnOff;


                var button = angular.element($element).find('button')[0];
                var buttonContainer = angular.element($element).find('div')[0];

                $scope.$watch(function () {
                    $scope.buttonWidth = button.offsetWidth;
                    $scope.elementWidth = buttonContainer.offsetWidth;
                });

                $scope.toggleBtn = function () {
                    $scope.toggle = !$scope.toggle;

                    publisher.publish($scope.toggle);

                    $scope.btnLabel = ($scope.toggle == true ) ? $scope.btnOn : $scope.btnOff;

                    var endAnimation;
                    if (!$scope.toggle) { //is on
                        endAnimation = $scope.elementWidth - $scope.buttonWidth;
                    } else { //is off
                        endAnimation = 0;
                    }

                    TweenMax.to(button, .25, {left: endAnimation, ease: "Circ.easeOut"});

                }

                //TODO work this in
                //TODO pass string or array
                publisher.all('maps').notify(function(result) {

                })

            },
            templateUrl: 'app/ng/directives/ftdui/toggle-switch/toggle-switch.html'
        }
    }]);