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
                    if ( configObj ) {
                        if ( configObj.types ) {
                            types = (typeof configObj.types == 'string') ? configObj.split(' ') : configObj.types;
                        }
                    } else {
                        types = this.types;
                    }

                    this.data = value;
                    if (this.config.saveHistory) {this.history.push(value)};

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
                                    subscribers[i].fn.call(subscribers[i].context, arg);
                                } else {
                                    if (subscribers[i].fn === arg && subscribers[i].context === context) {
                                        subscribers.splice(i, 1);
                                    }
                                }
                            }
                        }
                    });

                },

                addType: function( newType ) {
                    this.types.push( newType );
                },

                status:function( fn ) {
                  //TODO callback for publisher status
                },

                subscriberStatus:function() {

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
                update : function(value) {
                    this.data = value;
                }
            };

            var makeSubscriber = function(publisherId, type, fn, context, config) {
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

                s.fn = fn;
                s.context = context;

                /**
                 * if there is a config object, save it
                 *
                 */
                s.config = (config != null) ? config : {};

                /**
                 * Latest data set by the publisher.
                 */
                s.data = null;

                /**
                 * History of published data.
                 */
                s.history = [];


                return s;
            };


            /**
             * Can only subscribe to one type.
             * @param publisherId
             * @param fn
             * @param config
             * @param context
             */
            var subscribe = function (publisherId, fn, config, context) {

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

                fn = typeof fn === "function" ? fn : context[fn];

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


                cache.subscribers[publisherId][type].push( makeSubscriber(publisherId, type, fn, context, config) );

                /**
                 * Return data from the publisher, if any exists
                 *
                 * //TODO may have to be returned as a promise
                 */
                if (cache.publishers[publisherId]) {
                    fn.call(context, cache.publishers[publisherId].data);
                }
            };


            return {
                makePublisher: makePublisher,
                subscribe: subscribe
            }
        }
        ]
    })