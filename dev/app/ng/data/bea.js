define(['angular', 'underscore', 'preprocess'], function (angular, _, p) {
    p.loadOrder('bea');



    angular.module('app.bea', [])
        .provider('beaData', function ipProvider() {


            this.$get = ['$q', '$http', "beaApiKey", function ($q, $http, beaApiKey) {


                var dataSets = {
                    RegionalData:'RegionalData'
                }

                var KeyCodes = {

                    //Per capita personal income
                    PCPI_CI:"PCPI_CI"


                }

                var GeoFips = {
                    state: 'STATE'
                }


                var Params =  {
                    baseUrl : "http://www.bea.gov/api/data/?",
                    UserId : beaApiKey,
                    method : 'GetData',
                    datasetname : dataSets.RegionalData,
                    KeyCode:KeyCodes.PCPI_CI,
                    GeoFIPS:GeoFips.state,
                    ResultFormat:'json'
                }




                return {
                    params: getParams
                }


            }]
        })

});

