/**
 * %%templateName servicesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['angular', 'preprocess'], function(angular, p){
    p.log('servicesModule')
  angular.module('app.servicesModule', []).
    value('version', '0.1');
});