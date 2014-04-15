/**
 * %%templateName directivesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular', 'app'], function(angular, app){

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("directivesModule")
    }

  angular.module('ftd.directivesModule', [])

});