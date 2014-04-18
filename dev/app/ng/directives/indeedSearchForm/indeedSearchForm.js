define(['loadFileAngular', 'loadFileUnderscore', 'loadFileUaParser', "jquery", 'loadFileIndeedJobs'], function (angular, _, UAParser) {


    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    var IndeedSearchModalInstanceCtrl = function ($scope, $modalInstance, indeedData) {

        $scope.indeed = {
            what: indeedData.params().query(),
            where: indeedData.params().location()};

        var parser = new UAParser();
        $scope.ua = parser.getResult().browser.name;

        $scope.findJobsModal = function () {
//            $modalInstance.close($scope.selected.item);
            if ($scope.indeed.what == undefined || $scope.indeed.where == null) {
                $scope.indeed.where = "";
            }

//            console.log($scope.indeed.what);

            indeedData.params().query($scope.indeed.what);
            indeedData.params().location($scope.indeed.where);
            indeedData.getData().then(function (results) {
//                console.log("results from indeed: ", results);
            });

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    angular.module('ftd.indeedModule', [])
        .controller('IndeedModalSearchCtrl', ['$scope', '$modal', '$log', 'indeedData', function ($scope, $modal, $log, indeedData) {


        }])

        .directive('indeedJobs', ['$compile', 'indeedData','$modal', function ($compile, indeedData, $modal) {

            return {
                restrict: 'EA',
                link: function ($scope, $element, $attr) {

                    $scope.indeed = {
                        what: indeedData.params().query(),
                        where: indeedData.params().location()};

                    var parser = new UAParser();
                    $scope.ua = parser.getResult().browser.name;


                    $scope.findJobs = function () {

                        if ($scope.indeed.what == undefined || $scope.indeed.where == null) {
                            $scope.indeed.where = "";
                        }


                        indeedData.params().query($scope.indeed.what);
                        indeedData.params().location($scope.indeed.where);
                        indeedData.getData().then(function (results) {
                        });

                    }

                    $scope.open = function () {

                        var modalInstance = $modal.open({

                            templateUrl: 'IndeedSearchModalContent.html',
                            controller: IndeedSearchModalInstanceCtrl,
                            resolve: {
                                indeedData: function () {
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

                },
                templateUrl: "app/ng/directives/indeedSearchForm/indeedSearchForm.html"
            };

        }])
});

