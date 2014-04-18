/**
 * %%templateName providersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'loadFileZillowMapMU'], function (angular) {


    angular.module('ftd.topojsonMapData', [])
        .provider('d3MapData', function () {

            this.$get = ['$q', '$http', function ($q, $http) {

                var getStatesAbbr = function (_state) {
                    var deferred = $q.defer();

                        $http.get('app/data/data-dist-us-states-abbreviations/us-states-name-key.json', {cache:true})
                            .then(function(result) {

                                if (_state != null) {
                                    deferred.resolve(result.data[_state].toLowerCase());
                                } else {
                                    deferred.reject('no state argument');
                                }
                            }, function(error) {
                                deferred.reject(error);
                            });


                    return deferred.promise;
                };

                //TODO get state list to use underscore to prune other list
                var getStates = function() {
                    var deferred = $q.defer();

                    $http.get('app/data/data-dist-us-states-abbreviations/us-states-name-key.json', {cache:true})
                        .then(function(result) {
                            deferred.resolve(result.data);
                        }, function(error) {
                            deferred.reject(error);
                        });


                    return deferred.promise;
                }

                /**
                 * US map with states
                 * @returns {*}
                 */
                var getUsMap = function() {
                    var deferred = $q.defer();

                    $http.get("app/data/data-dist-topojson-us/2013/us/us-states-10m.json", {cache:true})
                        .then(function(result) {
                            deferred.resolve(result.data);
                        }, function(error) {
                            deferred.reject(error);
                        });


                    return deferred.promise;
                }

                /**
                 * Zip Codes by state
                 * @type {string}
                 */
                var urlZipcodePrefix = "app/data/data-dist-topojson-us/2013/us/states/zipcodes/";
                var getStateZipCodes = function (name) {
                    var deferred = $q.defer();

                    getStatesAbbr(name).then(function (result) {
                        $http.get(urlZipcodePrefix + result + "-zipcodes.json", {cache:true}).then(function(result) {
                            deferred.resolve(result.data);
                        })
                    }, function(error) {
                        deferred.reject(error);
                    })
                    return deferred.promise;
                };


                /**
                 * Counties
                 * @type {string}
                 */
                var urlCountyPrefix = "app/data/data-dist-topojson-us/2013/us/states/counties/";
                var getStateCounties = function (name) {
                    var deferred = $q.defer();

                    getStatesAbbr(name).then(function (result) {
                        $http.get(urlCountyPrefix + result + "-counties.json", {cache:true}).then(function(result) {
                            deferred.resolve(result.data);
                        }, function(error) {
                            deferred.reject(error);
                        })
                    }, function(error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };


                return {
                    getStatesAbbr: getStatesAbbr,
                    getUsMap:getUsMap,
                    getStateZipCodes:getStateZipCodes,
                    getStateCounties:getStateCounties,
                    getStates:getStates
                }

            }]
        })

})