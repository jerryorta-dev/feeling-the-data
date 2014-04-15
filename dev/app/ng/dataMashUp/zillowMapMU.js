/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'loadFilePreprocess', 'loadFileUnderscore', 'zillowData', 'loadFileD3MapData'], function (angular, app, _) {

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
        .factory('ZillowMapZipcodeMU', ['$q', 'ZillowGetRegionChildren', 'd3MapData', function ($q, ZillowGetRegionChildren, d3MapData) {

            var getMashUpByState = function (state) {

                return d3MapData.getStatesAbbr(state).then(function (stateAbbr) {

                    return $q.all([
                        ZillowGetRegionChildren.getDataByState(stateAbbr),
                        d3MapData.getStateCounties(state)
                    ])

                }).then(function (mashedData) {

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
                    _.each(mashedData[0].data.response.list.region, function(value, index, list) {

                        if (value.zindex != undefined && value.zindex != null) {
                            this[value.name.toString()] = value.zindex;
                        } else {
                            this[value.name.toString()] = 0;
                        }


                    }, zillowArrayToObject);

                    return {
                        zillow:{
                            data:zillowArrayToObject,
                            meta:zillowMeta
                        },
                        map:mashedData[1]
                    }

                })




            };

            return {
                getMashUpByState: getMashUpByState
            }

        }])


});