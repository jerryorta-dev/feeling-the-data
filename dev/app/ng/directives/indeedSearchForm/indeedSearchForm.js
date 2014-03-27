define(['angular', 'preprocess', "factoriesModule", "directivesModule"], function (angular, p, d3, topojson) {
    p.loadOrder('indeed directive');

    angular.module('app.directivesModule')
      .factory('indeedDataFactory', ['$q', 'Restangular', function ($q, Restangular) {
        return Restangular.withConfig(function (RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl("http://api.indeed.com/ads/");
          RestangularConfigurer.setDefaultRequestParams('get',
            {
              format: "json",
              publisher: 4600389599611799,
              limit: 100,
              latlong: 1,
              indpubnum:4600389599611799
            });

        }).all('apisearch');
      }])
        .directive('indeedJobs', ['$compile', 'indeedDataFactory', function ($compile, indeedDataFactory) {
            p.loadOrder('indeed jobs directive');
            return {
                restrict: 'EA',
                link: function($scope, $element, $attr) {
                  $scope.indeed = {what: "what", where: "where"};

                  $scope.findJobs = function() {
                    console.log(navigator.userAgent)
                  }

                  console.log(indeedDataFactory.getList())
                },
              templateUrl:"app/ng/directives/indeedSearchForm/indeedSearchForm.html"
            };

        }])
});

