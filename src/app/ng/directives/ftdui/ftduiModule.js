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

            /**
             * Allows for asynchronous instantiation of publishers and subscribers
             * @type {{publishers: {}, subscribers: {}, publisherCallback: {}}}
             */
            var cache = {
                publishers: {},
                subscribers: {},
                publisherCallback: {}
            };


            var deferFactory = function (config) {

                var d = {};

                d.thenFunction = null;
                d.errorFunction = null;
                d.notifyFunction = null;

                /**
                 * if there is a config object, save it
                 *
                 */
                d.config = (config != null) ? config : {};

                var applyDeferredCallbacks = function () {
                    d.deferred = null;
                    d.deferred = $q.defer();
                    d.deferred.promise.then(
                        d.thenFunction,
                        d.errorFunction,
                        d.notifyFunction
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
                if (d.config.then) {
                    if (typeof d.config.then === 'function') {
                        d.thenFunction = function (result) {
                            d.config.then.call(this, result);
                        }
                    }

                    if (typeof d.config.then === 'array') {
                        d.thenFunction = function (result) {
                            d.config.then[0].call(d.config.then[1], result);
                        }
                    }

                }

                if (d.config.error) {
                    if (typeof d.config.error === 'function') {
                        d.errorFunction = function (result) {
                            d.config.error.call(this, result);
                        }
                    }

                    if (typeof d.config.error === 'array') {
                        d.errorFunction = function (result) {
                            d.config.error[0].call(d.config.error[1], result);
                        }
                    }

                }

                if (d.config.notify) {
                    if (typeof d.config.notify === 'function') {
                        d.notifyFunction = function (result) {
                            d.config.notify.call(this, result);
                        }
                    }

                    if (typeof d.config.notify === 'array') {
                        d.notifyFunction = function (result) {
                            d.config.notify[0].call(d.config.notify[1], result);
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
                d.then = function (fn, context) {

                    d.thenFunction = function (result) {
                        fn.call(context, result);
                    };

                    applyDeferredCallbacks();
                };

                d.error = function (fn, context) {

                    d.errorFunction = function (result) {
                        fn.call(context, result);
                    };

                    applyDeferredCallbacks();
                };

                d.notify = function (fn, context) {
//                    console.log(fn);

                    d.notifyFunction = function (result) {
                        fn.call(context, result);
                    };

                    applyDeferredCallbacks();
                };

                return d;
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
                            types = (typeof configObj.types == 'string') ? configObj.types.split(' ') : configObj.types;
                        }
                    } else {
                        types = this.types;
                    }

                    this.data = value;
                    if (this.config.saveHistory) {
                        this.history.push(value)
                    }

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
                },

                all: function (types) {


                }

            };


            /**
             *
             * Method to make a publisher based on the publisher function above.
             *
             * @param o
             */
            function makePublisher(publisherId, initValue, config, newPublisher) {

                var o = deferFactory(config);

                var n;
                for (n in newPublisher) {
                    o[n] = newPublisher[n];
                }


                var i;

                /**
                 * Iterate of publisher properties
                 */
                for (i in publisher) {

                    /**
                     * Only look at the functions of the publisher
                     */
                    if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {

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
                o.types = (o.config.types != null) ? (typeof o.config.types == 'string') ? o.config.types.split(' ') : o.config.types : [];

                o.subscriberCallback = {};
                angular.forEach(o.types, function (type, index, list) {
                    o.subscriberCallback[type] = [];
                })

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
                        o.publish(o.config.types, initValue);
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
                 * Make subscriber
                 */
                var s = deferFactory(config);

                /**
                 * Create a publisher id for subscribers
                 */
                if (!cache.subscribers[publisherId]) {
                    cache.subscribers[publisherId] = {};
                }

                /**
                 * if there is a config object, save it
                 *
                 */
                s.config = (config != null) ? config : {};

                /**
                 * Type of subscriber, same as publisher type
                 * @type {*|string}
                 */
                s.type = (config && config.type != null) ? config.type : 'any';

                if (typeof cache.subscribers[publisherId][s.type] === "undefined") {
                    cache.subscribers[publisherId][s.type ] = [];
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


                var i;

                /**
                 * Iterate of subscriber properties
                 */
                for (i in subscriber) {

                    /**
                     * Only look at the functions of the subscriber
                     */
                    if (subscriber.hasOwnProperty(i) && typeof subscriber[i] === "function") {

                        /**
                         * if the subscribers' property is a function, assign it to the
                         * "make subscriber" object s
                         */
                        s[i] = subscriber[i];
                    }
                }

                s.context = context;


                /**
                 * Latest data parsed by the subscriber.
                 */
                s.data = null;

                /**
                 * History of published data.
                 */
                s.history = [];


                /**
                 * Save in cache
                 */
                cache.subscribers[publisherId][s.type].push(s);





                /**
                 * Options to return
                 */
                if (s.config.return) {

                    if (s.config.return == 'subscriber') {
                        return s;
                    }

                    if (s.config.return == 'promise') {
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