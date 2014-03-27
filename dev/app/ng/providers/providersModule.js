/**
 * %%templateName providersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function (angular, p) {
    p.loadOrder("providersModule");

  angular.module('app.providersModule', [])
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

          getSomething: function() {
            return this.somethingToDo;
          }


        }

        api = new API(config);

      }

      this.getApiService = function() {
        return api;
      }


      this.$get = function ($q, $http) {
        var self = this;
        return {
          doSomething:function(somethingToDo) {
            return self.getApiService().doSomething(somethingToDo);
          },
          getSomething: function() {
            return self.getApiService().getSomething();
          }
        }
      }
    })
    .provider('ip', function ipProvider() {

      this.$get = ['$q', '$http', function ($q, $http) {

        var deferred = $q.defer();

        $http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK')
          .success(function(data) {
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