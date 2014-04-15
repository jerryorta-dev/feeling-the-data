/**
 * Created by jerryorta on 3/14/14.
 */
define(["jquery", "underscore"], function () {


    var PreProcessor = (function () {

        var constants = {
            SHOW_CONSOLE_LOG: true, //Turn off all console.logs
            SHOW_LOAD_ORDER: false, //Turn off all console.logs
            VERSION: 1.0,
            TYPE: 'app'
        };

        this.constant = function (key) {
            return constants[key];
        };

        return function () {

        };

    })();

    PreProcessor.prototype.cons = function () {
        return {
            SHOW_CONSOLE_LOG: constant('SHOW_CONSOLE_LOG'), //Turn off all console.logs
            SHOW_LOAD_ORDER: constant('SHOW_LOAD_ORDER'), //Turn off all console.logs
            VERSION: constant('VERSION'),
            TYPE: constant('TYPE')
        }
    };


    PreProcessor.prototype.log = function (msg) {
        if (constant('SHOW_CONSOLE_LOG')) {
            console.log(msg);
        }
    };


    PreProcessor.prototype.getBaseUrl = function () {
        return location.protocol + "//" + location.hostname +
            (location.port && ":" + location.port) + "/";
    };

    PreProcessor.prototype.getBasePath = function () {
        return location.pathname.substring(1, location.pathname.lastIndexOf('/') + 1);
    };

    PreProcessor.prototype.getPathTo = function (path) {
        //add trailing slash if there is not one
        if (!(path.substr(path.length - 1) == '/')) {
            path += '/';
        }

        return this.getBasePath() + path;
    };

    PreProcessor.prototype.pluck = function (data, key) {
        if (key) {
            return _.pluck(data, key);
        }

        return data;
    }

    PreProcessor.prototype.min = function (data, key) {
        return _.min(this.pluck(data, key));
    };

    PreProcessor.prototype.max = function (data, key) {
        return _.max(this.pluck(data, key));
    };

    PreProcessor.prototype.sum = function (data, key) {
        return _.reduce(this.pluck(data, key), function (memo, num) {
            return memo + num;
        }, 0);
    };

    PreProcessor.prototype.average = function (data, key) {
        return this.sum(this.pluck(data, key)) / _data.length;
    };

    PreProcessor.prototype.median = function (data, key) {

        var values = this.pluck(data, key);

        values.sort(function (a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    };


    PreProcessor.prototype.calculate = function (data, config) {


        var _rawData = this.pluck(data, config.key);

        var _data = [];


        /**
         * Clean up data.
         *
         * remove undefined and null values
         *
         * if number is a string, convert to a number
         */
        _.each(_rawData, function (value, index, list) {
            if (value != null && value != undefined) {

                if (typeof value === 'string') {
                    this.push(Number(value));
                } else {
                    this.push(value);
                }
            } else {
                if (config.zeroData) {
                    list[index] = 0;
                }
            }


        }, _data);


        var calc = {};

        if (config.min) {
            calc.min = this.min(_data);
        }

        if (config.max) {
            calc.max = this.max(_data);
        }

        if (config.average) {
            calc.average = this.average(_data);
        }

        if (config.median) {
            calc.median = this.median(_data);
        }

        if (config.sum) {
            calc.sum = this.sum(_data);
        }

        if (config.zeroData) {
           return {
               data:_rawData,
               meta:calc
           }
        }

        return calc;
    };

    /**
     * Takes a config object, returns a url with search
     *
     * argument example:
     *
     * config = {
     *      baseUrl:'http://www.someApiService.com',
     *      params:{
     *          api-key:'fookey',
     *          state:'texas',
     *          format:'json'
     *      }
     * }
     *
     * returns:
     * http://www.someApiService.com?api-key=fookey&state=texas&format=json
     *
     * @param config
     * @returns {string}
     */
    PreProcessor.prototype.createSearchUrl = function (config) {

        var url = config.baseUrl + "?";
        _.each(config.params, function (value, key, list) {
            url += key + "=" + value + "&";
        });
        url = url.substring(0, url.length - 1);

        return url;
    };


    var singletonInstance = null;

    var getPreProcessor = function () {

        if (singletonInstance === null) {
            singletonInstance = new PreProcessor();
        }

        return singletonInstance;
    }

//Return API
    return getPreProcessor();

})
;