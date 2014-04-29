/**
 * %%templateName directivesModuleTemplate.js %% Module.
 *
 * This is the directives angular module which
 * directives reference.
 */
angular.module('ftd.ui', [])

//
//var FTDPubSubCache = function () {
//  this.publishers = {};
//  this.subscribers = {};
//};

angular.module('ftd.ui')


/**
 * Cache the results of the mash-up;
 */
    .provider('ftd.ui.pubsub', function FTDPubSub() {
        this.$get = ['$q', function ($q) {

            /**
             * Allows for asynchronous instantiation of publishers and subscribers
             * @type {{publishers: {}, subscribers: {}, publisherCallback: {}}}
             */
            var cache = {
                publishers: {},
                subscribers: {},
                publisherCallback: {}
            };

            var pubsubFactory = function (config) {

                var d = {};

                d.typesToArray = function (_types) {
                    if (typeof _types === 'string') {
                        return _types.split(' ');
                    }

                    if (typeof _types === 'array') {
                        _types;
                    }
                };

                d.subscriberCallbacks = {};

                d.thenFunction = null;
                d.errorFunction = null;
                d.notifyFunction = null;

                /**
                 * if there is a config object, save it
                 *
                 */
                d.config = (config != null) ? config : {};

                d.applyDeferredCallbacks = function () {
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

                d.applyDeferredCallbacks();

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

                    d.applyDeferredCallbacks();
                };

                return d;
            };

            var publisher = {



                unsubscribe: function (type, fn, context) {
                    this.callSubscribers('unsubscribe', type, fn, context);
                },

                publish: function (value, types) {

                    var _types;

                    /**
                     * Config object overrides this.config, not add
                     * functionality to config.
                     */
                    if (types) {
                        if (types) {
                            _types = (typeof types == 'string') ? types.split(' ') : types;
                        }
                    } else {
                        _types = this.types;
                    }

                    this.data = value;
                    if (this.config.saveHistory) {
                        this.history.push(value)
                    }

                    this.callSubscribers('publish', _types, value);
                },

                //TODO need context?
                callSubscribers: function (action, types, arg, context) {
                    console.log('action', action);
                    console.log('types', types);
                    console.log('arg', arg);
                    console.log('context', context);
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

                subscriberCallback: function (data, type) {
                    //Subscriber can only have one type
                    console.log('from subscriber', data, type);
                    var _self = this;
                    //TODO get data from subscribers that have the same type

                    console.log('this.subscribers', this.subscribers[type])

                    //Get all subscriber call backs that include type provided
                    var allIncludedTypes = {};
                    var getSubscriberTypes = [];
                    var callbacks = [];
                    //TODO call publisher notify
                    angular.forEach(this.subscriberCallbacks, function (callback, key, clist) {
                        angular.forEach(callback.types, function (cType, index, tlist) {
                            //TODO deferred.notify
                            if (cType == type && !allIncludedTypes[cType]) {
                                allIncludedTypes[cType] = true;
                                getSubscriberTypes.push(cType);
                                callbacks.push(callback)
                            }
                        })
                    })

                    console.log(this.subscriberCallbacks, allIncludedTypes, getSubscriberTypes, callbacks)
                    var dataset = [];
                    angular.forEach(getSubscriberTypes, function (hasType, index, list) {


                        console.log('type .>>>', _self.subscribers[hasType])
                        angular.forEach(_self.subscribers[hasType], function (subscriber, index, list) {
                            console.log("subscriber", subscriber);
                            dataset.push(subscriber.data);
                        })
                    })

                    angular.forEach(callbacks, function (callback, index, list) {
                        callback.deferred.notify(dataset);
                    })


                },

                notify: function (_types, fn, context) {
                    var promiseApi = pubsubFactory();
                    this.subscriberCallbacks[_types] = promiseApi;
                    promiseApi.types = this.typesToArray(_types);
                    promiseApi.notify(fn, context)
                },

                all: function (types) {
                    var promiseApi = pubsubFactory();
                    this.subscriberCallbacks[types] = promiseApi;
                    promiseApi.types = this.typesToArray(types);
//          promiseApi.notify(fn, context);
                    return this.subscriberCallbacks[types];
                }

            };

            /**
             *
             * Method to make a publisher based on the publisher function above.
             *
             * @param o
             */
            function makePublisher(publisherId, initValue, config, newPublisher) {

                var o = pubsubFactory(config);

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
                ;

                o.publisherId = publisherId;

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
                if (o.config && o.config.types != null) {
                    o.types = o.typesToArray(o.config.types);
                } else {
                    o.types = [];
                }
//        o.types = (o.config.types != null) ? (typeof o.config.types == 'string') ? o.config.types.split(' ') : o.config.types : [];

                if (initValue) {
                    o.data = initValue;
                    o.history.push(initValue);
                }

                if (!cache.publishers[publisherId]) {
                    cache.publishers[publisherId] = o;
                }
                console.log("subscriber when publisher initted", cache.subscribers[publisherId])

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
                        o.publish(initValue, o.config.types);
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
                callPublisher: function (data) {
                    this.data = data;
                    if (cache.publishers[this.publisherId]) {
                        cache.publishers[this.publisherId].subscriberCallback(data, this.type);
                    }
                }
            };

            /**
             * Can only subscribe to one type.
             * @param publisherId
             * @param fn
             * @param config
             * @param context
             */
            var subscribe = function (publisherId, config, context, newSubscriber) {

                /**
                 * Make subscriber
                 */
                var s = pubsubFactory(config);

                var n;
                for (n in newSubscriber) {
                    s[n] = newSubscriber[n];
                }

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
                ;

                s.publisherId = publisherId;

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
                 * Type of subscriber, same as publisher type
                 * @type {*|string}
                 */
                s.type = (config && config.type != null) ? config.type : 'any';

                if (typeof cache.subscribers[publisherId][s.type] === "undefined") {
                    cache.subscribers[publisherId][s.type ] = [];
                }

                /**
                 * Save in cache
                 */
                cache.subscribers[publisherId][s.type].push(s);

                /**
                 * Get initial publisher value
                 *
                 * overrides deferFactory
                 */
                s.isInitted = false;
                s.notify = function (fn, context) {

                    s.notifyFunction = function (result) {
                        fn.call(context, result);
                    };

                    s.applyDeferredCallbacks();

                    if (!s.isInitted && cache.publishers[publisherId] && cache.publishers[publisherId].data) {
                        console.log("publisher when subscriber initted", cache.publishers[publisherId]);
                        cache.publishers[publisherId].publish(cache.publishers[publisherId].data, s.type);
                    }

                    s.isInitted = true;
                };

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
    });