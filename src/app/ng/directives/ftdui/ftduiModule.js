/**
 * %%templateName directivesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
angular.module('ftd.ui', [])

var UIControlCache = function () {
    this.cache = {};
};


angular.module('ftd.ui')

    .service('UIControlCache', UIControlCache)

/**
 * Cache the results of the mash-up;
 */
    .provider('ftd.pubsub', function UIControls() {
        this.$get = ['$q', 'UIControlCache', function ($q, cacheObj) {

            /**
             * Queue to store callbacks regestered by listeners
             * @constructor
             */
            var CallBackQueue = function () {

                /**
                 * Array of callbacks that are registered by
                 * listeners.
                 * @type {Array}
                 */
                this.callbacks = [];


                /**
                 * Value to be sent to registered callbacks
                 * @type {null}
                 */
                this.value = null;

                this.setValue = function (value) {

                    var _self = this;

                    /**
                     * Set value of queue
                     */
                    _self.value = value;
                    _self.callCallees()


                };

                /**
                 * if callbacks are registered,
                 * call them with new value
                 * @type {number}
                 */
                this.callCallees = function () {
                    var i = 0, l = this.callbacks.length;
                    if (l > 0) {
                        for (i; i < l; i++) {
                            //calling CallBackWrapper objects
                            this.callbacks[i].callback.call(null, this.value);
                        }
                    }
                };


                this.addCallee = function (callbackwrapper) {
                    this.callbacks.push(callbackwrapper);
                };


            };


            var CallBackWrapper = function (fn, callbackId) {
                this.callback = fn;
                this.id = (callbackId != null) ? callbackId : null;
            };


            var getCache = function (cacheId) {

                if (cacheObj.cache[cacheId] == null) {
                    cacheObj.cache[cacheId] = new CallBackQueue();
                    return  cacheObj.cache[cacheId];
                }

                return cacheObj.cache[cacheId];
            };


            var setControl = function (cacheId, initValue) {
                getCache(cacheId).value = initValue;
            };

            var updateValue = function (cacheId, updateValue) {
                getCache(cacheId)
            };

            var addCallee = function (cacheId, fn, calleeId) {
                getCache(cacheId).addCallee(new CallBackWrapper(fn, calleeId));
            };

            var getControlValue = function () {

            }

            var getControlValuePromise = function () {

            }


            return {
                'set': setControl,
                update: updateValue,
                ui: getControlValue,
                uiPromise: getControlValuePromise

            }
        }]
    })