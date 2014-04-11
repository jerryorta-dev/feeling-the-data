/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function (angular, p) {
    p.loadOrder("zillowData");
    angular.module('app.zillowData', [])


        .factory('ZillowGetRegionChildren', ['$q', '$http', "zillowApiKey", function ($q, $http, zillowApiKey) {

            var baseUrl = 'http://feelingthedata.com/app/php/zillowDataService.php';


            /**
             * http://www.zillow.com/howto/api/GetRegionChildren.htm
             *
             * childtype = county, zipcode
             * @type {{zws-id: *, state: null, childtype: string}}
             */
            var params = {
                "url":"GetRegionChildren",
                "zws-id": zillowApiKey,
                "state": null,
                childtype: "county"
            };

            var getDataByState = function (state) {

                params.state = state;

                return $http.get(p.createSearchUrl(baseUrl, params));
            };

            return {
                getDataByState: getDataByState
            }

        }])


});