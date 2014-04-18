/**
 * Created by jerryorta on 3/14/14.
 */
define(["loadFileJQuery", "loadFileUnderscore"], function () {


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