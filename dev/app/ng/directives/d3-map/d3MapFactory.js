/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function(angular, p){
    p.loadOrder("factoriesModule");
    angular.module('app.factoriesModule')
        .factory('GeoFactory', ['$q', 'Restangular', function ($q, Restangular) {
            return Restangular.withConfig(function (RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(p.getRestangularPath("app/data"));
                RestangularConfigurer.setRequestSuffix(".json");
                RestangularConfigurer.addResponseInterceptor(function(data, operation, what, url, response, deferred) {

                    var raw = {};
                    raw.type = data.type;
                    raw.objects = data.objects;
                    raw.arcs = data.arcs;
                    raw.transform = data.tranform;
                    data.raw = raw;


                    var newResponse;
                    if (operation === "getList") {
                        // Here we're returning an Array which has one special property metadata with our extra information
                        newResponse = [ data ];
                    } else {
                        // This is an element
                        newResponse = data;
                    }
                    return newResponse;


                    /*var newResponse = data;
                     if (angular.isArray(data)) {
                     angular.forEach(newResponse, function(value, key) {
                     newResponse[key].originalElement = angular.copy(value);
                     });
                     } else {
                     newResponse.originalElement = angular.copy(data);
                     }

                     return newResponse;*/

                });
            });
        }]);
});