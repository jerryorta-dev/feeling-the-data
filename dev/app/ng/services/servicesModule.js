/**
 * %%templateName servicesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'app'], function(angular, app){

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("servicesModule")
    }
  angular.module('ftd.servicesModule', []).
    value('version', '0.1');
});