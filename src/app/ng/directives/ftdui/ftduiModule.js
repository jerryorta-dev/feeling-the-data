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

                /**
                 * Latest data set by the publisher.
                 */
                data: null,

                /**
                 * History of published data.
                 */
                history: [],

                subscribers: {
                    any: []
                },

                subscribe: function (type, fn, context) {
                    type = type || 'any';
                    fn = typeof fn === "function" ? fn : context[fn];

                    if (typeof this.subscribers[type] === "undefined") {
                        this.subscribers[type] = [];
                    }
                    this.subscribers[type].push({fn: fn, context: context || this});
                },

                unsubscribe: function (type, fn, context) {
                    this.visitSubscribers('unsubscribe', type, fn, context);
                },

                publish: function (types, value) {
                    this.visitSubscribers('publish', types, value);
                },

                visitSubscribers: function (action, types, arg, context) {
                    var _self = this;
                    angular.forEach(types, function(type, index, list) {
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

                }




            };

            /**
             *
             * Method to make a publisher based on the publisher function above.
             *
             * @param o
             */
            function makePublisher(publisherId, newPublisher, init) {

                var o = (newPublisher != null) ? newPublisher : {};

                var i;

                /**
                 * Iterate of publisher properties
                 */
                for (i in publisher) {

                    /**
                     * Only look at the functions of the publisher
                     */
//                    if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
                    if (publisher.hasOwnProperty(i)) {

                        /**
                         * if the publisher's property is a function, assign it to the
                         * "make publisher" object o
                         */
                        o[i] = publisher[i];
                    }
                }

                if (init.value) {
                    o.data = init.value;
                    o.history.push(init.value);
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
                    if (init.value) {
                        o.publish(init.types, init.value);
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


            var subscribe = function (publisherId, type, fn, context) {
                if (!cache.subscribers[publisherId]) {
                    cache.subscribers[publisherId] = {};
                }

                type = type || 'any';
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

                cache.subscribers[publisherId][type].push({fn: fn, context: context});

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