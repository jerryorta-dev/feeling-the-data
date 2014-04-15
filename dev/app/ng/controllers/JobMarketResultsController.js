/**
 * Created by jerryorta on 4/14/14.
 */
define(['loadFileAngular', 'loadFileUnderscore', 'loadFilePreprocess', 'ua-parser', "jquery", 'ineedjobsData', 'ipData', 'd3MapDataJS', 'zillowData', 'beaDataJs', 'zmMashUp', 'MUUSMapGDPByState'], function (angular, _, app, UAParser) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("JobMarket Results")
    }





    angular.module('ftd.jobMarketsResultsModule', [])
        .controller('JobMarketResultsController', ['$scope', "MapControls", '$filter', '$timeout', 'indeedData', 'd3MapData', 'MUUSMapGDPByState', 'ZillowMapZipcodeMU', function($scope, MapControls, $filter, $timeout, indeedData, d3MapData, MUUSMapGDPByState, ZillowMapZipcodeMU) {

            // watch for data changes and re-render
            $scope.indeedData = indeedData.params();



            //newVals is an array
            $scope.$watch('indeedData.indeedResults', function (newVals, oldVals) {
                console.log($scope.indeedData);
                $scope.query = $scope.indeedData.query();
                $scope.location = $scope.indeedData.location();


                console.log("jobmarketresults",newVals)
//
            }, true);

        }])


});

