/**
 * %%templateName providersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'app', 'zmMashUp'], function (angular, app) {
    app.loadOrder("mapData");

    angular.module('ftd.topojsonMapData', [])


    var D3MapsCache = function () {
        this.usMap = null;
        this.getStatesAbbr = null;
        this.stateZipCodes = {};
    }

    D3MapsCache.prototype = {
        constructor:D3MapsCache
    }

    angular.module('ftd.topojsonMapData')
        .service('D3MapsCache', D3MapsCache)
        .provider('d3MapData', function () {

            this.$get = ['$q', '$http', 'D3MapsCache', function ($q, $http, D3MapsCache) {

                var getStatesAbbr = function (_state) {
                    var deferred = $q.defer();

                    if (D3MapsCache.getStatesAbbr != null) {
                        if (D3MapsCache.getStatesAbbr[_state] != null) {
                            deferred.resolve(D3MapsCache.getStatesAbbr[_state].toLowerCase());
                        } else {
                            deferred.reject("nostate");
                        }

                    } else {
                        $http.get('app/data/data-dist-us-states-abbreviations/us-states-name-key.json')
                            .then(function(result) {
                                D3MapsCache.getStatesAbbr = result.data;
                                if (_state != null) {
                                    deferred.resolve(result.data[_state].toLowerCase());
                                }
                            }, function(error) {
                                deferred.reject(error);
                            });
                    }

                    return deferred.promise;
                };

                var getUsMap = function() {
                    var deferred = $q.defer();

                    if (D3MapsCache.usMap != null) {
                        deferred.resolve(D3MapsCache.usMap);
                    } else {
                        $http.get("app/data/data-dist-topojson-us/2013/us/us-states-10m.json")
                            .then(function(result) {
//                                console.log("states", result)
                                D3MapsCache.usMap = result.data;
                                deferred.resolve(result.data);
                            });
                    }

                    return deferred.promise;
                }

                var urlZipcodePrefix = "app/data/data-dist-topojson-us/2013/us/states/zipcodes/";
                var getStateZipCodes = function (name) {
                    var deferred = $q.defer();

                    if (D3MapsCache.stateZipCodes[name] != null) {
                        deferred.resolve(D3MapsCache.stateZipCodes[name]);
                    } else {
                        getStatesAbbr(name).then(function (result) {
                            var url = urlZipcodePrefix + result + "-zipcodes.json";
                            $http.get(url).then(function(result) {
                                D3MapsCache.stateZipCodes[name] = result.data;
                                deferred.resolve(result.data);
                            })
                        }, function(error) {
                            deferred.reject(error);
                        })
                    }

                    return deferred.promise;
                };

                var urlCountyPrefix = "app/data/data-dist-topojson-us/2013/us/states/counties/";
                var getStateCounties = function (name) {
                    var deferred = $q.defer();

                    if (D3MapsCache.stateZipCodes[name] != null) {
                        deferred.resolve(D3MapsCache.stateZipCodes[name]);
                    } else {
                        getStatesAbbr(name).then(function (result) {
                            var url = urlCountyPrefix + result + "-counties.json";
                            $http.get(url).then(function(result) {
                                D3MapsCache.stateZipCodes[name] = result.data;
                                deferred.resolve(result.data);
                            })
                        }, function(error) {
                            deferred.reject(error);
                        })
                    }

                    return deferred.promise;
                };


                return {
                    getStatesAbbr: getStatesAbbr,
                    getUsMap:getUsMap,
                    getStateZipCodes:getStateZipCodes,
                    getStateCounties:getStateCounties
                }

            }]
        })

})