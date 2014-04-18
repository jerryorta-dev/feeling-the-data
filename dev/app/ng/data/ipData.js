/**
 * %%templateName providersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular'], function (angular) {


    angular.module('ftd.ip', [])

        .provider('ip', function ipProvider() {

            this.$get = ['$q', '$http', function ($q, $http) {

                var deferred = $q.defer();

                $http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK', {cache:false})
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


})