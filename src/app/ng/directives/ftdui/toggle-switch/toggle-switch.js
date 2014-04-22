angular.module('ftd.ui.toggleswitch', [])

/**
 * <ftd-ui-toggleswitch></ftd-ui-toggleswitch>
 */
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
      controller: ['$scope', '$element', '$attrs', '$transclude', 'ftd.ui.pubsub', function ($scope, $element, $attrs, $transclude, ps) {

        $scope.toggle = true;
        $scope.btnLabel = ($scope.toggle == true ) ? $scope.btnOn : $scope.btnOff;

//                UIControls.set($scope.name, true);
        //TODO Create generic publisher
//        ps.makePublisher($scope.name,)

        var button = angular.element($element).find('button')[0];
        var buttonContainer = angular.element($element).find('div')[0];

        $scope.$watch(function () {
          $scope.buttonWidth = button.offsetWidth;
          $scope.elementWidth = buttonContainer.offsetWidth;
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

//                    UIControls.update($scope.name, $scope.toggle);
          TweenMax.to(button, .25, {left: endAnimation, ease: "Circ.easeOut"});

        }

      }],
      templateUrl: 'app/ng/directives/ftdui/toggle-switch/toggle-switch.html'
    }
  });