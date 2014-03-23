/**
 * %%templateName controllersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function(angular, p){
    p.log('controllersModule');

  angular.module('app.controllersModule', []).
      controller('MainAppController', ['$scope', function($scope) {

      }])
});