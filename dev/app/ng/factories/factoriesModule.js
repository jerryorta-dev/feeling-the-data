/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function (angular, p) {
    p.loadOrder("factoriesModule");
    angular.module('app.factoriesModule', [])
        .factory('ZillowGetRegionChildren', ['$q', '$http', "zillowApiKey", function ($q, $http, zillowApiKey) {

            var baseUrl = 'http://feelingthedata.com/app/php/zillowDataService.php';

            var params = {
                "zws-id": zillowApiKey,
                "state": null,
                childtype: "zipcode"
            };

            var getDataByState = function (state) {

                params.state = state;

                return $http.get(p.createSearchUrl(baseUrl, params));
            };

            return {
                getDataByState: getDataByState
            }

        }])

    /**
     *  Get date from:
     *
     *  ZillowGetRegionChildren factory
     *  d3MapData.getStatesAbbr provider
     *
     *  returns promise
     *
     */
        .factory('ZillowMapZipcodeMU', ['$q', 'ZillowGetRegionChildren', 'd3MapData', function ($q, ZillowGetRegionChildren, d3MapData) {

            var getMashUpByState = function (state) {

                return d3MapData.getStatesAbbr(state).then(function (stateAbbr) {

                    return $q.all([
                        ZillowGetRegionChildren.getDataByState(stateAbbr),
                        d3MapData.getStateZipCodes(state)
                    ])

                }).then(function (mashedData) {

                    return {
                        zillow:mashedData[0].data.response.list.region,
                        map:mashedData[1]
                    }

                })




            };

            return {
                getMashUpByState: getMashUpByState
            }

        }])


});