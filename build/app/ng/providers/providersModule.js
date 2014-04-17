/**
 * %%templateName providersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'loadFilePreprocess'], function (angular, app) {
    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("providersModule")
    }

    /*angular.module('ftd.providersModule', [])
        .provider('api', function apiProvider() {

            var api;

            this.initApiService = function (config) {

                console.log("initting Api Service")

                var API = function (config) {
                    this.initialConfig = config;
                    this.somethingToDo;
                }

                API.prototype = {
                    constructor: API,

                    doSomething: function (somethingToDo) {
                        this.somethingToDo = this.initialConfig + " Bar does " + somethingToDo;
                        return this.initialConfig + "Bar does " + somethingToDo;
                    },

                    getSomething: function () {
                        return this.somethingToDo;
                    }


                }

                api = new API(config);

            }

            this.getApiService = function () {
                return api;
            }


            this.$get = function ($q, $http) {
                var self = this;
                return {
                    doSomething: function (somethingToDo) {
                        return self.getApiService().doSomething(somethingToDo);
                    },
                    getSomething: function () {
                        return self.getApiService().getSomething();
                    }
                }
            }
        })
        .provider('ip', function ipProvider() {

            this.$get = ['$q', '$http', function ($q, $http) {

                var deferred = $q.defer();

                $http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK')
                    .success(function (data) {
                        var ip = {};
                        ip.ip = data.ip;
                        ip.hostname = data.hostname;
                        ip.loc = data.loc; //Latitude and Longitude
                        ip.org = data.org; //organization
                        ip.city = data.city;
                        ip.region = data.region; //state
                        ip.country = data.country;
                        ip.phone = data.phone; //city area code

                        deferred.resolve(ip);
                    });

                return deferred.promise;

            }]
        })

    var D3MapsCache = function () {
        this.usMap = null;
        this.getStatesAbbr = null;
        this.stateZipCodes = {};
    }

    D3MapsCache.prototype = {
        constructor:D3MapsCache
    }

    angular.module('ftd.providersModule')
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
        })*/

})