define(['angular', 'underscore', 'preprocess', 'ua-parser', "jquery", "factoriesModule", "directivesModule", "providersModule"], function (angular, _, p, UAParser, $) {
    p.loadOrder('indeed directive');

    angular.module('app.directivesModule')
        .provider('indeedData', function ipProvider() {

            this.$get = ['$q', '$http', 'ip', function ($q, $http, ip) {



                var parser = new UAParser();

                var paramsInstance = null;

                var getParams = function() {
                    if (paramsInstance == null) {
                        paramsInstance = new Params();

                        paramsInstance.useragent(parser.getResult().browser.name + '-' + parser.getBrowser().version)

                        return paramsInstance;
                    } else {
                        return paramsInstance;
                    }
                }

                var Params = function() {
                    this.baseUrl = "http://api.indeed.com/ads/apisearch";

                    this.url = "";

                    this.params = {};
                    this.params.publisher = 4600389599611799;
                    this.params.v = 2;
                    this.params.format = "json";
                    this.params.callback = "JSON_CALLBACK";
                    this.params.q = "";
                    this.params.l = "";
                    this.params.sort = "";
                    this.params.radius="";
                    this.params.st = "";
                    this.params.jt = "";
                    this.params.start = "";
                    this.params.limit = 100;
                    this.params.fromage = "";
                    this.params.highlight = "";
                    this.params.filter = 1;
                    this.params.latlong = 1;
                    this.params.co = "us";
                    this.params.chnl = "";
                    this.params.userip = "";
                    this.params.useragent = "";

                };

                Params.prototype = {
                    constructor:Params,

                    getBaseurl:function() {
                        return this.baseUrl;
                    },

                    getParams:function() {
                        return this.params;
                    },

                    query:function(q) {
                      this.params.q = encodeURIComponent(q);

                    },

                    location:function(l) {
                      this.l = encodeURIComponent(l);

                    },

                    userip:function(ip) {
                        this.params.userip = ip;
                    },


                    useragent:function(ua) {
                        this.params.useragent = ua;
                    },

                    getUrl:function() {
                        this.url = this.baseUrl + "?";
                        _.each(this.params, function(value, key, list) {
                            if (key != "format" || key != "callback") {
                                this.url += key + "=" + value + "&";
                            }

                        }, this);

                        this.url = this.url.substring(0, this.url.length - 1);

                        return this.url;
                    },
                    jsonp:function() {
                        this.url = this.baseUrl + "?";
                        _.each(this.params, function(value, key, list) {
                            this.url += key + "=" + value + "&";
                        }, this);

                        this.url = this.url.substring(0, this.url.length - 1);

                        return this.url;
                    }

                }

                var getData = function() {
                    return ip.then(function (ipResult) {
                        getParams().userip(ipResult.ip);
                        return ipResult.ip;
                    }).then( function(ip) {

                        getParams().getUrl();

                        var deferred = $q.defer();

                        $http.jsonp(getParams().jsonp())
                            .success(function(data) {
                                console.log(data);
                                deferred.resolve(data);
                            });
                        var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";


//                        $.getJSON( getParams().getBaseurl(), getParams().getParams())
//                            .done(function( data ) {
//                                console.log(data)
//                            });

                        $.get( "http://api.indeed.com/ads/apisearch?publisher=4600389599611799&q=java&l=austin%2C+tx&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2", function( data ) {
                           console.log(data);
                        });



                    return deferred.promise;

                    })
                }


                return {
                    params: getParams(),
                    getData: getData()
                }



            }]
        })
        .directive('indeedJobs', ['$compile', 'indeedData', function ($compile, indeedData) {
            p.loadOrder('indeed jobs directive');
            return {
                restrict: 'EA',
                link: function ($scope, $element, $attr) {
                    $scope.indeed = {what: "what", where: "where"};

                    var parser = new UAParser();
                    $scope.ua = parser.getResult().browser.name + '-' + parser.getBrowser().version;

                    indeedData.params.query('angularjs');
                    indeedData.params.location('Austin, Tx');
                    indeedData.getData;




                    $scope.findJobs = function () {

                        /*indeedDataFactory.all('apisearch').getList(
                            {
                                q: $scope.indeed.what,
                                l: $scope.indeed.where,
                                userip: $scope.ip,
                                useragent: $scope.ua
                            }).then(function (result) {
                            console.log(result);
                        })*/
                    }

                },
                templateUrl:"app/ng/directives/indeedSearchForm/indeedSearchForm.html"
            };

        }])
});

