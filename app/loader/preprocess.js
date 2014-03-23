/**
 * Created by jerryorta on 3/14/14.
 */
define(["underscore"],function () {


    var PreProcessor = (function () {

        var constants = {
            SHOW_CONSOLE_LOG: true, //Turn off all console.logs
            VERSION: 1.0,
            TYPE: 'app'
        };

        this.constant = function (key) {
            return constants[key];
        }

        return function () {

        };

    })();



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

    PreProcessor.prototype.getRestangularPath = function (path) {
        //remove leading slash if there is one
        if (path.substr(0, 1) == '/') {
            path = path.substring(1);
        }

        //Restangular will add the4 trailing slash
        if (path.substr(path.length - 1) == '/') {
            path = path.substr(0, path.length - 1);
        }

        return '/' + this.getBasePath() + path;
    };


    var singletonInstance = null;

    var getPreProcessor = function() {

        if (singletonInstance === null) {
            singletonInstance = new PreProcessor();
        }

        return singletonInstance;
    }

  //Return API
  return {
    log:getPreProcessor().log,
    getBasePath: getPreProcessor().getBasePath,
    getBaseUrl: getPreProcessor().getBaseUrl,
    getPathTo: getPreProcessor().getPathTo,
    getRestangularPath: getPreProcessor().getRestangularPath
  }

});