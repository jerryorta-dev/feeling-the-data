/**
 * Created by jerryorta on 4/14/14.
 */
angular.module('ftd.jobMarketsResultsModule', [])
    .controller('JobMarketResultsController', ['$scope', "MapControls", '$filter', '$timeout', 'indeedData', 'd3MapData', 'MUUSMapGDPByState', 'ZillowMapZipcodeMU', function ($scope, MapControls, $filter, $timeout, indeedData, d3MapData, MUUSMapGDPByState, ZillowMapZipcodeMU) {

        //GDP by state
        MUUSMapGDPByState.UsGDPByState('2012').then(function (result) {
            $scope.stateGdpMin = result.bea.meta.min;
            $scope.stateGdpMax = result.bea.meta.max;
        })


        // watch for data changes and re-render
        $scope.indeedData = indeedData.params();


        //newVals is an array
        $scope.$watch('indeedData.indeedResults', function (newVals, oldVals) {
//            console.log($scope.indeedData);
            $scope.query = $scope.indeedData.query();
            $scope.location = $scope.indeedData.location();


//            console.log("jobmarketresults", newVals)
//
        }, true);

    }])