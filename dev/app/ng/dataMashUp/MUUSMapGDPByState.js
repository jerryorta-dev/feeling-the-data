/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'app', 'd3MapDataJS', 'beaDataJs'], function (angular, app) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("MU USMapGDPByState")
    }
    angular.module('ftd.zillowMapMU', [])


    /**
     *  Get date from:
     *
     *  ZillowGetRegionChildren factory
     *  d3MapData.getStatesAbbr provider
     *
     *  returns promise
     *
     */
        .factory('MUUSMapGDPByState', ['$q', 'd3MapData', 'beaData', function ($q, d3MapData, beaData) {

            var UsGDPByState = function (year) {

                d3MapData.getStatesAbbr()

                var deferred = $q.defer();

                $q.all([
                    beaData.gdpByState(year),
                    d3MapData.getUsMap()

                ]).then(function (mashedData) {
                    console.log(mashedData);
                    deferred.resolve({
                        bea: mashedData[0],
                        map: mashedData[1]
                    });
                }, function(error) {
                    console.log("MUUSMapGDPByState Error", error)
                    deferred.reject(error);

                })

                return deferred.promise;
            };

            return {
                UsGDPByState: UsGDPByState
            }

        }])


});