/**
 * %%templateName directivesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
define(['loadFileAngular'], function(angular){
  angular.module('ftdui', [])

    var UIControlCache = function() {
        this.cache = {};
    };


    angular.module('ftdui')

        .service('UIControlCache', UIControlCache)

    /**
     * Cache the results of the mash-up;
     */
        .provider('UIControls', function UIControls() {
            this.$get = ['$q', function ($q) {

                var cacheObj = {};

                var getControlValue = function(cacheId) {
                    return cacheObj[cacheId];
                };

                var getControlValuePromise = function(cacheId) {
                    var deferred = $q.defer();

                    deferred.resolve(cacheObj[cacheId]);

                    return deferred.promise;

                };

                var setControl = function(cacheId, value) {
                    cacheObj[cacheId] = value;
                };

                var update = function(cacheId, value) {
                    console.log("update", cacheId, value);
                    cacheObj[cacheId] = value;
                };

                return {
                    ui:getControlValue,
                    uiPromise:getControlValuePromise,
                    'set':setControl,
                    update:update
                }
            }]
        })

});