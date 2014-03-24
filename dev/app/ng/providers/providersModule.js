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
})