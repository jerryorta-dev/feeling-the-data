/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'loadFilePreprocess', 'loadFileUnderscore', 'loadFileZillowData', 'loadFileD3MapData'], function (angular, app, _) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("zillowMapMU")
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
        .factory('ZillowMapZipcodeMU', ['$q', 'ZillowGetRegionChildren', 'd3MapData', 'parsingCache', function ($q, ZillowGetRegionChildren, d3MapData, parsingCache) {

            var getMashUpByState = function (state, config) {
                var deferred = $q.defer();

                var errorCallback = function(error) {
                    deferred.reject(error);
                }

                /**
                 * flush will make ajax call again if year is different
                 * from previous calls. IE, $http url is different.
                 */
                var flush = (config != null) ? ((config.flush != null) ? config.flush : false) : false;

                if (parsingCache.get(state).parseInProgress && !flush) {
                    return parsingCache.get(state).getResult();
                } else {
                    parsingCache.get(state).parseInProgress = true;
                    console.log("getting data")

                    d3MapData.getStatesAbbr(state).then(function (stateAbbr) {
                        console.log(stateAbbr)

                        $q.all([
                            ZillowGetRegionChildren.getDataByState(stateAbbr),
                            d3MapData.getStateCounties(state)
                        ]).then(function(mashedData) {

                            console.log('mashedData',mashedData)

                            var zillowMeta = app.calculate(mashedData[0].data.response.list.region,
                                {
//                            zeroData:true,
                                    key: "zindex",
                                    min: true,
                                    max: true
                                });


                            /**
                             * Create reference object with keys as county name,
                             * value as zindex
                             */
                            var zillowArrayToObject = {};
                            _.each(mashedData[0].data.response.list.region, function (value, index, list) {

                                if (value.zindex != undefined && value.zindex != null) {
                                    this[value.name.toString()] = value.zindex;
                                } else {
                                    this[value.name.toString()] = 0;
                                }


                            }, zillowArrayToObject);

                            var result = {
                                zillow: {
                                    data: zillowArrayToObject,
                                    meta: zillowMeta
                                },
                                map: mashedData[1]
                            };

                            /**
                             * Cache the result
                             * @type {{bea: {data: {}}, map: *}}
                             */
                            parsingCache.get(state).setResult(result);

                            deferred.resolve(result);
                        })

                    }, errorCallback);

                }

                return deferred.promise;


            };

            return {
                getMashUpByState: getMashUpByState
            }

        }])


});