/**
 * Created by jerryorta on 3/14/14.
 */
define(["underscore"],function () {

  var getBaseUrl = function () {
    return location.protocol + "//" + location.hostname +
      (location.port && ":" + location.port) + "/";
  }

  var getBasePath = function () {
    return location.pathname.substring(1, location.pathname.lastIndexOf('/') + 1)
  }

  var getPathTo = function (path) {

    //add trailing slash if there is not one
    if (!(path.substr(path.length - 1) == '/')) {
      path += '/';
    }

    return getBasePath() + path;
  };

  var getRestangularPath = function (path) {
    //remove leading slash if there is one
    if (path.substr(0, 1) == '/') {
      path = path.substring(1);
    }

    //Restangular will add the4 trailing slash
    if (path.substr(path.length - 1) == '/') {
      path = path.substr(0, path.length - 1);
    }

    return '/' + getBasePath() + path;
  }

  //Return API
  return {
    getBasePath: getBasePath,
    getBaseUrl: getBaseUrl,
    getPathTo: getPathTo,
    getRestangularPath: getRestangularPath
  }

});