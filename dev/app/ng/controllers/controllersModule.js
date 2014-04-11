/**
 * %%templateName controllersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'app'], function(angular, app){
    app.loadOrder('controllersModule');

  angular.module('ftd.controllersModule', []).
      controller('MainAppController', ['$scope', function($scope) {
          app.loadOrder('MainAppController');
      }])
});