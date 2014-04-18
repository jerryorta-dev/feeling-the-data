/**
 * %%templateName servicesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular'], function(angular){

  angular.module('ftd.servicesModule', []).
    value('version', '0.1');
});