define(['angular', 'underscore', 'app', 'ua-parser', "jquery", 'ineedjobsData'], function (angular, _, p, UAParser) {
    p.loadOrder('indeed data');


    angular.module('ftd.indeedModule', [])
        .directive('indeedJobs', ['$compile', 'indeedData', function ($compile, indeedData) {
            p.loadOrder('indeed jobs directive');
            return {
                restrict: 'EA',
                link: function ($scope, $element, $attr) {
                    $scope.indeed = {what: "what", where: "where"};

                    var parser = new UAParser();
                    $scope.ua = parser.getResult().browser.name;


                    $scope.findJobs = function () {

                        indeedData.params().query($scope.indeed.what);
                        indeedData.params().location($scope.indeed.where);
                        indeedData.getData().then(function (results) {
//                            console.log("results from indeed: ", results);
                        });

                    }

                },
                templateUrl: "app/ng/directives/indeedSearchForm/indeedSearchForm.html"
            };

        }])
 });

