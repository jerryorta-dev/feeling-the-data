define(['angular', 'underscore', 'app', 'ua-parser', 'ipData'], function (angular, _, p, UAParser) {
    p.loadOrder('indeed data');


    window.INDEED_CALLBACK = function (data) {
        console.log("INDEED_CALLBACK NOT OVERWRITTEN BY FUNCTION");
    };


    window.INDEED_DATA = function (data) {
        window.INDEED_CALLBACK.call(null, data);
    };


    angular.module('ftd.indeedJobsData', [])
        .provider('indeedData', function ipProvider() {


            this.$get = ['$q', '$http', 'ip', "indeedApiKey", function ($q, $http, ip, indeedApiKey) {

                var parser = new UAParser();

                var paramsInstance = null;

                var getParams = function () {
                    if (paramsInstance == null) {
                        paramsInstance = new Params(indeedApiKey);

                        paramsInstance.useragent(parser.getResult().browser.name);

                        return paramsInstance;
                    } else {
                        return paramsInstance;
                    }
                };

                var Params = function (indeedApiKey) {
                    this.baseUrl = "http://api.indeed.com/ads/apisearch";

                    this.url = "";

                    this.indeedparams = {};
                    this.indeedparams.publisher = indeedApiKey; //Jerry Orta
                    this.indeedparams.v = 2;
                    this.indeedparams.format = "json";
//                    this.indeedparams.callback = "JSON_CALLBACK";
                    this.indeedparams.callback = "INDEED_DATA";
//                    this.indeedparams.callback = "test._1";
                    this.indeedparams.q = "";
                    this.indeedparams.l = "";
                    this.indeedparams.sort = "";
                    this.indeedparams.radius = "";
                    this.indeedparams.st = "";
                    this.indeedparams.jt = "";
                    this.indeedparams.start = "";
                    this.indeedparams.limit = 100;
                    this.indeedparams.fromage = "";
                    this.indeedparams.highlight = "";
                    this.indeedparams.filter = 1;
                    this.indeedparams.latlong = 1;
                    this.indeedparams.co = "us";
                    this.indeedparams.chnl = "";
                    this.indeedparams.userip = "1.2.3.4";
                    this.indeedparams.useragent = "Mozilla/%2F4.0%28Firefox%29";

                    this.indeedResults = [];

                };

                Params.prototype = {
                    constructor: Params,

                    getBaseurl: function () {
                        return this.baseUrl;
                    },

                    results: function (data) {
                        if (data != null) {
                            this.indeedResults = data;
                            return true;
                        }

                        return this.indeedResults;
                    },


                    query: function (q) {
//                        console.log("what", q);
                        this.indeedparams.q = encodeURIComponent(q);

                    },

                    location: function (l) {
//                        console.log("where", l);
                        this.indeedparams.l = encodeURIComponent(l);

                    },

                    userip: function (ip) {
                        this.indeedparams.userip = encodeURIComponent(ip);
                    },


                    useragent: function (ua) {
                        this.indeedparams.useragent = encodeURIComponent(ua);
                    },


                    xml: function () {
                        this.url = this.baseUrl + "?";
                        _.each(this.indeedparams, function (value, key, list) {
                            var valid = true;

                            if (value == "json") {
                                valid = false;
                            }

                            if (value == "JSON_CALLBACK") {
                                valid = false;
                            }

                            if (valid) {
                                this.url += key + "=" + value + "&";
                            }


                        }, this);

                        this.url = this.url.substring(0, this.url.length - 1);

//                        console.log(this.url);

                        return this.url;
                    },
                    jsonp: function () {
                        this.url = this.baseUrl + "?";
                        _.each(this.indeedparams, function (value, key, list) {
                            this.url += key + "=" + value + "&";
                        }, this);

                        this.url = this.url.substring(0, this.url.length - 1);
//                        console.log(this.url);
                        return this.url;
                    }

                }

                var getData = function () {
//                    console.log(getParams().jsonp());
                    return ip.then(function (ipResult) {
                        getParams().userip(ipResult.ip);
                        return ipResult.ip;
                    }).then(function (ip) {

//                        getParams().getUrl();

                        var deferred = $q.defer();

                        window.INDEED_CALLBACK = function (data) {
                            deferred.resolve(data.results);
                            getParams().results(data.results);
                        }


                        $http.jsonp(getParams().jsonp());


                        return deferred.promise;

                    })
                };

                var getResults = function() {
                    return getParams().results()
//                    var deferred = $q.defer();
//
//                    deferred.resolve(getParams().results());
//
//                    return deferred.promise;

                }


                return {
                    params: getParams,
                    getData: getData,
                    results: getResults
                }


            }]
        })

});

