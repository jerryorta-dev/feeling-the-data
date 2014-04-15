/**
 * %%templateName filtersModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'loadFilePreprocess'], function(angular, app){

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("filtersModule")
    }
  angular.module('ftd.filtersModule', [])
});