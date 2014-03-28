define(['angular', 'preprocess', 'ua-parser', "factoriesModule", "directivesModule", "providersModule"], function (angular,
                                                                                                                   p,
                                                                                                                   UAParser) {
  p.loadOrder('indeed directive');

  angular.module('app.directivesModule')
   /* .factory('indeedDataFactory', ['$q', 'Restangular', function ($q, Restangular) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        console.log(RestangularConfigurer);
        RestangularConfigurer.setBaseUrl("http://api.indeed.com/ads/");
//        RestangularConfigurer.setJsonp(true);
//        RestangularConfigurer.jsonp = false;
        RestangularConfigurer.setDefaultRequestParams('get',
          {
            format: "json",
            publisher: 4600389599611799,
            limit: 100,
            latlong: 1,
//            indpubnum: 4600389599611799,
            v: 2,
            callback: "JSON_CALLBACK"
          });*/

        /*RestangularConfigurer.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
          var newResponse;
          console.log(data);
          if (operation === "getList") {
            // Here we're returning an Array which has one special property metadata with our extra information
            newResponse = data.results;
          }
          return newResponse;
        });*/

//      });
//    }])
    .directive('indeedJobs', ['$compile', 'Restangular', 'ip', function ($compile, Restangular, ip) {
      p.loadOrder('indeed jobs directive');
      return {
        restrict: 'EA',
        link: function ($scope, $element, $attr) {
          $scope.indeed = {what: "what", where: "where"};

          var parser = new UAParser();
          $scope.ua = parser.getResult().browser.name + '-' + parser.getBrowser().version;

          ip.then(function (result) {
            $scope.ip = result.ip;
          })

          $scope.findJobs = function () {

            /*Restangular.all('apisearch').getList({userip: $scope.ip, useragent: $scope.ua}).then(function (result) {
              console.log(result);
            })
*/
          }

        },
        templateUrl: "app/ng/directives/indeedSearchForm/indeedSearchForm.html"
      };

    }])
});

