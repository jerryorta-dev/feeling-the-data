/**
 * Created by jerryorta on 4/15/14.
 */
var ParsingCacheDictionary = function () {
    this.cache = {};
};


angular.module('ftd.parsingCache', [])

    .service('ParsingCacheDictionary', ParsingCacheDictionary)

/**
 * Cache the results of the mash-up;
 */
    .provider('parsingCache', function parsingCacheProvider() {
        this.$get = ['$q', 'ParsingCacheDictionary', function ($q, cacheObj) {

            var ParsingCacheObject = function () {

                /**
                 * Variable to cache data.
                 *
                 * You can only call getResult() to retrieve this value as a promise;
                 * @type {null}
                 */
                this.data = null;

                /**
                 * Lots of data has been called through $http,
                 * and parsing through all this data is taking considerable time.
                 * In the meantime, prevent additional service calls to
                 * retrieve and parse the data again ( controllers have
                 * repeated calls ).
                 * @type {boolean}
                 */
                this.parseInProgress = false;

                /**
                 * Callback function called when parsing is complete --
                 * $http ajax call and all data iterations (parsing)
                 * are complete.
                 * @type {null}
                 */
                this.onParseComplete = null;
            };

            ParsingCacheObject.prototype = {
                constructor: ParsingCacheObject,

                /**
                 * $http call and parsing are complete, cache the data,
                 * call the callback function.
                 * @param value
                 */
                setResult: function (value) {
                    this.data = value;
                    if (this.onParseComplete != null) {
                        this.onParseComplete.call(null, value);
                    }
                },

                /**
                 * Check if this.data already has data,
                 * if so, return it as a promise, if not, create
                 * a callback function to return data once parsing
                 * is complete.
                 *
                 * @returns {*}
                 */
                getResult: function () {
                    var deferred = $q.defer();

                    if (this.data != null) {
                        deferred.resolve(this.data);
                    } else {
                        this.onParseComplete = function (result) {
                            deferred.resolve(result);
                        };
                    }
                    return deferred.promise;
                }
            };

            var getCache = function (cacheId) {

                if (cacheObj.cache[cacheId] == null) {
                    cacheObj.cache[cacheId] = new ParsingCacheObject();
                    return  cacheObj.cache[cacheId];
                }

                return cacheObj.cache[cacheId];
            };

            var deleteCache = function (cacheId) {
                delete  cacheObj.cache[cacheId];
            };

            return {
                get: getCache,
                delete: deleteCache
            }
        }]
    })
