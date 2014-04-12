/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'app', 'underscore', 'd3MapDataJS', 'beaDataJs'], function (angular, app, _) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("MU USMapGDPByState")
    }
    angular.module('ftd.beaD3Map', [])


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
                var deferred = $q.defer();

                $q.all([
                    beaData.gdpByState(year),
                    d3MapData.getUsMap(),
                    d3MapData.getStates()

                ]).then(function (mashedData) {

                    var dataObject = mashedData[0].data.BEAAPI.Results.Data;

                    //TODO include only states

                    console.log("dataObject", dataObject);
                    var bea = {
                        data: {}
                    };
                    _.each(dataObject, function (value, index, list) {
                        this[value.GeoName] = value.DataValue
                    }, bea.data);

                    bea.meta = app.calculate(dataObject, "DataValue", "min", "max");


                    deferred.resolve({
                        bea: bea,
                        map: mashedData[1]
                    });
                }, function (error) {
                    console.log("MUUSMapGDPByState Error", error)
                    deferred.reject(error);

                });

                return deferred.promise;
            };

            return {
                UsGDPByState: UsGDPByState
            }

        }])


});