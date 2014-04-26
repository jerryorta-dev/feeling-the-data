/**
 * %%templateName directivesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
angular.module('ftd.ui', [])

var FTDPubSubCache = function () {
    this.publishers = {};
    this.subscribers = {};
};

angular.module('ftd.ui')

    .service('ftd.ui.pubsub.cache', FTDPubSubCache)

/**
 * Cache the results of the mash-up;
 */
    .provider('ftd.ui.pubsub', function FTDPubSub() {
        this.$get = ['$q', 'ftd.ui.pubsub.cache', function ($q) {

            var cache = {
                publishers: {},
                subscribers: {}
            };

            var publisher = {



                unsubscribe: function (type, fn, context) {
                    this.callSubscribers('unsubscribe', type, fn, context);
                },

                publish: function (value, configObj) {

                    var types;

                    /**
                     * Config object overrides this.config, not add
                     * functionality to config.
                     */
                    if (configObj) {
                        if (configObj.types) {
                            types = (typeof configObj.types == 'string') ? configObj.split(' ') : configObj.types;
                        }
                    } else {
                        types = this.types;
                    }

                    this.data = value;
                    if (this.config.saveHistory) {
                        this.history.push(value)
                    }
                    ;

                    this.callSubscribers('publish', types, value);
                },

                callSubscribers: function (action, types, arg, context) {
                    var _self = this;
                    angular.forEach(types, function (type, index, list) {
                        var pubtype = type || 'any',
                            subscribers = (_self.subscribers && _self.subscribers[pubtype]) ? _self.subscribers[pubtype] : null;
                        if (subscribers) {
                            var i,
                                max = subscribers ? subscribers.length : 0;

                            for (i = 0; i < max; i += 1) {
                                if (action === 'publish') {
//                                    subscribers[i].fn.call(subscribers[i].context, arg);
                                    subscribers[i].deferred.notify(arg)
                                } else {
                                    //TODO this does not work with promises
                                    if (subscribers[i].fn === arg && subscribers[i].context === context) {
                                        subscribers.splice(i, 1);
                                    }
                                }
                            }
                        }
                    });

                },

                addType: function (newType) {
                    this.types.push(newType);
                }

            };


            /**
             *
             * Method to make a publisher based on the publisher function above.
             *
             * @param o
             */
            function makePublisher(publisherId, initValue, config, newPublisher) {

                var o = (newPublisher != null) ? newPublisher : {};

                var i;

                /**
                 * Iterate of publisher properties
                 */
                for (i in publisher) {

                    /**
                     * Only look at the functions of the publisher
                     */
                    if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
//                    if (publisher.hasOwnProperty(i)) {

                        /**
                         * if the publisher's property is a function, assign it to the
                         * "make publisher" object o
                         */
                        o[i] = publisher[i];
                    }
                }

                /**
                 * if there is a config object, save it
                 *
                 */
                o.config = (config != null) ? config : {};

                //defaults
                o.saveHistory = false;

                /**
                 * Latest data set by the publisher.
                 */
                o.data = null;

                /**
                 * History of published data.
                 */
                o.history = [];

                o.subscribers = {
                    any: []
                };


                /**
                 * Types are an array, but may be passed as a string that is space delimited.
                 * @type {Array|*}
                 */
                o.types = (config.types != null) ? (typeof config.types == 'string') ? config.types.split(' ') : config.types : [];


                if (initValue) {
                    o.data = initValue;
                    o.history.push(initValue);
                }

                if (!cache.publishers[publisherId]) {
                    cache.publishers[publisherId] = o;
                }

                /**
                 * If any subscribers already exist
                 */
                if (cache.subscribers[publisherId]) {

                    /**
                     * Apply publisher context to existing subscribers
                     */
                    angular.forEach(cache.subscribers[publisherId], function (subscriber, subscriberType, list) {
                        if (subscriber.context == null) {
                            subscriber.context = cache.publishers[publisherId];
                        }
                    });

                    /**
                     * Keep a reference of subscribers
                     */
                    o.subscribers = cache.subscribers[publisherId];

                    /**
                     * if publisher has an init value, send it to subscribers
                     */
                    if (initValue) {
                        o.publish(config.types, initValue);
                    }

                } else {
                    /**
                     * Create subscribers cache if not exist
                     * @type {Array}
                     */
                    cache.subscribers[publisherId] = o.subscribers;
                }

                return o;

            };

            var subscriber = {

            };


            /**
             * Can only subscribe to one type.
             * @param publisherId
             * @param fn
             * @param config
             * @param context
             */
            var subscribe = function (publisherId, config, context) {

                /**
                 * Create a publisher id for subscribers
                 */
                if (!cache.subscribers[publisherId]) {
                    cache.subscribers[publisherId] = {};
                }


                /**
                 * Type of subscriber, same as publisher type
                 * @type {*|string}
                 */
                var type;

                if (config) {
                    type = (config.type != null) ? config.type : 'any';
                }

//                fn = typeof fn === "function" ? fn : context[fn];

                if (typeof cache.subscribers[publisherId][type] === "undefined") {
                    cache.subscribers[publisherId][type] = [];
                }

                /**
                 * If context needs to change to that of the publisher, it will be done
                 * when the publisher is created.
                 */
                if (!context && cache.publishers[publisherId]) {
                    context = cache.publishers[publisherId];
                } else {
                    context = null;
                }


                /**
                 * Make subscriber
                 */
                var s = {};

                var i;

                /**
                 * Iterate of subscriber properties
                 */
                for (i in subscriber) {

                    /**
                     * Only look at the functions of the subscriber
                     */
                    if (subscriber.hasOwnProperty(i) && typeof subscriber[i] === "function") {
//                    if (publisher.hasOwnProperty(i)) {

                        /**
                         * if the subscribers' property is a function, assign it to the
                         * "make subscriber" object s
                         */
                        s[i] = subscriber[i];
                    }
                }



                s.context = context;

                /**
                 * if there is a config object, save it
                 *
                 */
                s.config = (config != null) ? config : {};

                /**
                 * Latest data parsed by the subscriber.
                 */
                s.data = null;

                /**
                 * History of published data.
                 */
                s.history = [];


                cache.subscribers[publisherId][type].push(s);

                /**
                 * Return data from the publisher, if any exists
                 *
                 * //TODO may have to be returned as a promise
                 */
                if (cache.publishers[publisherId]) {
                    s.deferred.notify(cache.publishers[publisherId].data)
//                    fn.call(context, cache.publishers[publisherId].data);
                }


                s.thenFunction = null;
                s.errorFunction = null;
                s.notifyFunction = null;

                var applyDeferredCallbacks = function() {
                    s.deferred = null;
                    s.deferred = $q.defer();
                    s.deferred.promise.then(
                        s.thenFunction,
                        s.errorFunction,
                        s.notifyFunction
                    );
                };

                /**
                 * config object is a function
                 *
                 * {
                 *   then:function(result) { ... }
                 * }
                 *
                 * config object is an array
                 *
                 * {
                 *   then:[ function(result) { ... }, context ]
                 * }
                 */
                if (config.then) {
                    if (typeof config.then === 'function') {
                        s.thenFunction = function ( result ) {
                            config.then.call(this, result);
                        }
                    }

                    if (typeof config.then === 'array') {
                        s.thenFunction = function( result ) {
                            config.then[0].call( config.then[1], result);
                        }
                    }

                }

                if (config.error) {
                    if (typeof config.error === 'function') {
                        s.errorFunction = function ( result ) {
                            config.error.call(this, result);
                        }
                    }

                    if (typeof config.error === 'array') {
                        s.errorFunction = function( result ) {
                            config.error[0].call( config.error[1], result);
                        }
                    }

                }

                if (config.notify) {
                    if (typeof config.notify === 'function') {
                        s.notifyFunction = function ( result ) {
                            config.notify.call(this, result);
                        }
                    }

                    if (typeof config.notify === 'array') {
                        s.notifyFunction = function( result ) {
                            config.notify[0].call( config.notify[1], result);
                        }
                    }

                }

                applyDeferredCallbacks();

                /**
                 * If subscriber object is returned, allow
                 * notify object to be directly returned.
                 *
                 * var bar = function(result) {...}
                 *
                 * var foo = uiControl.makeSubscriber('foo',
                 * {
                 *     type:'myType',
                 *     return:'subscriber'
                 * })
                 *
                 * foo.notify(bar)
                 *
                 * @param fn
                 */
                s.then = function (fn, context) {

                    s.thenFunction = function(result) {
                        fn.call(context, result);
                    };

                    applyDeferredCallbacks();
                };

                s.error = function (fn, context) {

                    s.errorFunction = function(result) {
                        fn.call(context, result);
                    };

                    applyDeferredCallbacks();
                };

                s.notify = function (fn, context) {

                    s.notifyFunction = function(result) {
                        fn.call(context, result);
                    };

                    applyDeferredCallbacks();
                };


                s.publisherCallbackPromise = null;

                s.callPublisher = function(data, context) {
                    if (data) {
                        s.data = data;
                    }

                    if (s.data && s.publisherCallbackPromise) {
                        s.publisherCallbackPromise.notify(data)
                    }

                };


                /**
                 * Options to return
                 */
                if (config.return) {

                    if (config.return == 'subscriber') {
                        return s;
                    }

                    if (config.return == 'promise') {
                        return s.deferred.promise;
                    }


                }

                /**
                 * return promise by default
                 */
                return s;
            };


            return {
                makePublisher: makePublisher,
                subscribe: subscribe
            }
        }
        ]
    })