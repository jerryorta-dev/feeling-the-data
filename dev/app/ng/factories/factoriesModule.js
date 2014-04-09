/**
 * %%templateName factoriesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function(angular, p){
    p.loadOrder("factoriesModule");
  angular.module('app.factoriesModule', [])
      .factory('ZillowGetRegionChildren', ['$q', '$http', "zillowApiKey", function($q, $http, zillowApiKey) {

          var baseUrl = 'http://feelingthedata.com/app/php/dataService.php';
          var params = {
              "zws-id": zillowApiKey,
              "state":null,
              childtype:"zipcode"
          }

          var getDataByState = function(state) {

              params.state = state;

              return $http.get(p.createSearchUrl(baseUrl, params));
          }

          return {
              getDataByState:getDataByState
          }

      }])




});