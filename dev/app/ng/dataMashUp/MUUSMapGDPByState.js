/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'loadFilePreprocess', 'loadFileUnderscore', 'loadFileParsedDataCache', 'loadFileD3MapData', 'loadFileBea'], function (angular, app, _) {

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
        .factory('MUUSMapGDPByState', ['$q', 'd3MapData', 'beaData', 'parsingCache', function ($q, d3MapData, beaData, parsingCache) {

                var UsGDPByState = function (year, config) {
                    var deferred = $q.defer();

                    /**
                     * flush will make ajax call again if year is different
                     * from previous calls. IE, $http url is different.
                     */
                    var flush = (config != null) ? ((config.flush != null) ? config.flush : false) : false;

                    if (parsingCache.get('MUUSMapGDPByState').parseInProgress && !flush) {
                        return parsingCache.get('MUUSMapGDPByState').getResult();
                    } else {
                        parsingCache.get('MUUSMapGDPByState').parseInProgress = true;
                        console.log('Get GDP By State')

                        $q.all([
                            beaData.gdpByState(year),
                            d3MapData.getUsMap(),
                            d3MapData.getStates()

                        ]).then(function (mashedData) {

                            var dataObject = mashedData[0].data.BEAAPI.Results.Data;

                            var bea = {
                                data: {}
                            };

                            /**
                             * Get array of states only, dataset contains more than just states
                             * @type {Array}
                             */
                            var valueRange = [];
                            _.each(dataObject, function (value, index, list) {
                                if (mashedData[2].hasOwnProperty(value.GeoName)) {
                                    valueRange.push(value.DataValue);
                                    this[value.GeoName] = value.DataValue
                                }
                            }, bea.data);


                            bea.meta = app.calculate(valueRange, {
                                min: true,
                                max: true
                            });

                            var result = {
                                bea: bea,
                                map: mashedData[1]
                            };

                            /**
                             * Cache the result
                             * @type {{bea: {data: {}}, map: *}}
                             */
                            parsingCache.get('MUUSMapGDPByState').setResult(result);

                            deferred.resolve(result);

                        }, function (error) {
                            console.log("MUUSMapGDPByState Error", error)
                            deferred.reject(error);

                        });
                    }

                    return deferred.promise;
                };

                return {
                    UsGDPByState: UsGDPByState
                }

        }]);
});