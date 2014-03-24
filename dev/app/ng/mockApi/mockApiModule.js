/**
 * %%templateName mockApiModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function(angular, p){
    p.loadOrder("mockApiModule");
  angular.module('app.mockApiModule', [])
});