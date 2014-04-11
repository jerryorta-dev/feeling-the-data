/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'app'], function (angular, app) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("zillowData")
    }
    angular.module('ftd.zillowData', [])


        .factory('ZillowGetRegionChildren', ['$q', '$http', "zillowApiKey", function ($q, $http, zillowApiKey) {



            /**
             * http://www.zillow.com/howto/api/GetRegionChildren.htm
             *
             * childtype = county, zipcode
             * @type {{zws-id: *, state: null, childtype: string}}
             */
            var config = {
                baseUrl:'http://feelingthedata.com/app/php/zillowDataService.php',
                params: {
                    "url": "GetRegionChildren",
                    "zws-id": zillowApiKey,
                    "state": null,
                    childtype: "county"
                }
            }

            var getDataByState = function (state) {

                config.params.state = state;

                return $http.get(app.createSearchUrl(config));
            };

            return {
                getDataByState: getDataByState
            }

        }])


});