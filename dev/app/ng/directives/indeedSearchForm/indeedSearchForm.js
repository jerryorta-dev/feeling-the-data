define(['angular', 'underscore', 'app', 'ua-parser', "jquery", 'ineedjobsData'], function (angular, _, app, UAParser) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("indeed data")
    }


    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    var IndeedSearchModalInstanceCtrl = function ($scope, $modalInstance, indeedData) {

        $scope.indeed = {
            what:indeedData.params().query(),
            where:indeedData.params().location()};

        var parser = new UAParser();
        $scope.ua = parser.getResult().browser.name;

        $scope.ok = function () {
//            $modalInstance.close($scope.selected.item);
            if ($scope.indeed.what == undefined || $scope.indeed.where == null) {
                $scope.indeed.where = "";
            }

            console.log($scope.indeed.what);

            indeedData.params().query($scope.indeed.what);
            indeedData.params().location($scope.indeed.where);
            indeedData.getData().then(function (results) {
                console.log("results from indeed: ", results);
            });

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };



    angular.module('ftd.indeedModule', [])
        .controller('IndeedModalSearchCtrl', ['$scope', '$modal', '$log', 'indeedData', function($scope, $modal, $log, indeedData) {

            $scope.open = function () {

                var modalInstance = $modal.open({

                    templateUrl: 'IndeedSearchModalContent.html',
                    controller: IndeedSearchModalInstanceCtrl,
                    resolve: {
                        indeedData:function() {
                            return indeedData;
                        }

                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }])

        .directive('indeedJobs', ['$compile', 'indeedData', function ($compile, indeedData) {

            return {
                restrict: 'EA',
                link: function ($scope, $element, $attr) {



                    var parser = new UAParser();
                    $scope.ua = parser.getResult().browser.name;


                    $scope.findJobs = function () {



//                        if ($scope.indeedWhere == undefined || $scope.indeedWhere == null) {
//                            $scope.indeedWhere = "";
//                        }
//
//                        console.log("what", $scope.indeedWhat)
//                        console.log("where", $scope.indeedWhere);
//
//                        indeedData.params().query($scope.indeedWhat);
//                        indeedData.params().location($scope.indeedWhere);
//                        indeedData.getData().then(function (results) {
//                            console.log("results from indeed: ", results);
//                        });

                    }

                },
                templateUrl: "app/ng/directives/indeedSearchForm/indeedSearchForm.html"
            };

        }])
 });

