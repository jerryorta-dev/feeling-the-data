/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
angular.module('ftd.zillowData', [])


    .factory('ZillowGetRegionChildren', ['$q', '$http', "zillowApiKey", 'ftd.utils', function ($q, $http, zillowApiKey, utils) {


        /**
         * http://www.zillow.com/howto/api/GetRegionChildren.htm
         * childtype = county, zipcode
         * @type {{zws-id: *, state: null, childtype: string}}
         */
        var config = {
            baseUrl: 'http://www.zillow.com/webservice/GetRegionChildren.htm',
            params: {
                "url": "GetRegionChildren",
                "zws-id": zillowApiKey,
                "state": null,
                childtype: "county"
            }
        }

        var getDataByState = function (state) {

            config.params.state = state;

            return $http.get(utils.createSearchUrl(config), {cache: true});
        };

        return {
            getDataByState: getDataByState
        }

    }])


