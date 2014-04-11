/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'app', 'zillowData', 'd3MapDataJS'], function (angular, app) {
    app.loadOrder("zillowMapMU");
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
        .factory('ZillowMapZipcodeMU', ['$q', 'ZillowGetRegionChildren', 'd3MapData', function ($q, ZillowGetRegionChildren, d3MapData) {

            var getMashUpByState = function (state) {

                return d3MapData.getStatesAbbr(state).then(function (stateAbbr) {

                    return $q.all([
                        ZillowGetRegionChildren.getDataByState(stateAbbr),
                        d3MapData.getStateCounties(state)
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