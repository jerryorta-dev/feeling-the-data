/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'loadFilePreprocess', 'loadFileUnderscore', 'loadFileD3MapData', 'loadFileBea'], function (angular, app, _) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("MU USMapGDPByState")
    }


    angular.module('ftd.beaD3Map', [])


    /**
     * Cache the results of the mash-up;
     */
        .provider('MUUSMapGDPByStateParsingCache', function MUUSMapGDPByStateParsingCacheProvider() {
            this.$get = ['$q', function ($q) {

                /**
                 * Variable to cache data.
                 *
                 * You can only call getResult() to retrieve this value as a promise;
                 * @type {null}
                 */
                this.mashupResult = null;

                /**
                 * Lots of data has been called through $http,
                 * and parsing through all this data is taking considerable time.
                 * In the meantime, prevent additional service calls to
                 * retrieve and parse the data again ( controllers have
                 * repeated calls ).
                 * @type {boolean}
                 */
                this.parseInProgress = false;

                /**
                 * Callback function called when parsing is complete --
                 * $http ajax call and all data iterations (parsing)
                 * are complete.
                 * @type {null}
                 */
                this.onParseComplete = null;

                /**
                 * $http call and parsing are complete, cache the data,
                 * call the callback function.
                 * @param value
                 */
                var setResult = function (value) {
                    this.mashupResult = value;
                    if (this.onParseComplete != null) {
                        this.onParseComplete.call(null, value);
                    }
                };

                /**
                 * Check if this.mashupResult already has data,
                 * if so, return it as a promise, if not, create
                 * a callback function to return data once parsing
                 * is complete.
                 *
                 * @returns {*}
                 */
                var getResult = function () {
                    var deferred = $q.defer();

                    if (this.mashupResult != null) {
                        deferred.resolve(this.mashupResult);
                    } else {
                        this.onParseComplete = function (result) {
                            deferred.resolve(result);
                        };
                    }
                    return deferred.promise;
                };

                /**
                 * Api to set and get stuff.
                 */
                return {
                    parseInProgress: this.parseInProgress,
                    setResult: setResult,
                    getResult: getResult
                }


            }]
        })


    /**
     *  Get date from:
     *
     *  ZillowGetRegionChildren factory
     *  d3MapData.getStatesAbbr provider
     *
     *  returns promise
     *
     */
        .provider('MUUSMapGDPByState', function MUUSMapGDPByStateProvider() {


            this.$get = ['$q', 'd3MapData', 'beaData', 'MUUSMapGDPByStateParsingCache', function ($q, d3MapData, beaData, DataCache) {

                var UsGDPByState = function (year, config) {
                    var deferred = $q.defer();

                    /**
                     * flush will make ajax call again if year is different
                     * from previous calls. IE, $http url is different.
                     */
                    var flush = (config != null) ? ((config.flush != null) ? config.flush : false) : false;
//                    console.log('flush', flush);
//                    console.log('MUUSMapGDPByStateCache.mashupResult', MUUSMapGDPByStateCache.mashupResult)

                    if (DataCache.parseInProgress && !flush) {
                        return DataCache.getResult();
                    } else {
                        DataCache.parseInProgress = true;

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
                            DataCache.setResult(result);

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
            }];
        })
});