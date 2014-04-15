define(['angular', 'underscore', 'app'], function (angular, _, app) {

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("bea")
    }


    angular.module('ftd.bea', [])

    /**
     *
     *
     *
     * Key Codes:
     * http://bea.gov/api/data/?&UserID=E5311C0F-5662-4934-B043-69BA533F9959&method=GetParameterValues&datasetname=RegionalData&ParameterName=keycode&
     *
     */
        .provider('beaData', function beaDataProvider() {


            this.$get = ['$q', '$http', "beaApiKey", function ($q, $http, beaApiKey) {


                var dataSets = {
                    RegionalData: 'RegionalData'
                }

                var KeyCodes = {

                    //PerCapitaPersonalIncome
                    PerCapitaPersonalIncome: "PCPI_CI",
                    gdpByState: "GDP_SP"

                }

                var GeoFips = {
                    state: 'STATE'
                }


                var config = {
                    baseUrl: "http://www.bea.gov/api/data/",
                    params: {
                        UserId: beaApiKey,
                        method: 'GetData',
                        datasetname: dataSets.RegionalData,
                        KeyCode: KeyCodes.PerCapitaPersonalIncome,
                        GeoFIPS: GeoFips.state,
                        ResultFormat: 'json'
                    }

                }


                var gdpByState = function (year) {

//                    console.log('gdpByState', year)

                    var newConfig = angular.copy(config);
                    newConfig.params.year = year;
                    newConfig.params.KeyCode = KeyCodes.gdpByState;

                    var deferred = $q.defer();

                    $http.get(app.createSearchUrl(newConfig), {cache:true})
                        .then(function(result) {
//                            console.log(result);
                            deferred.resolve(result);
                        }, function(error) {
//                            console.log(error);
                            deferred.reject(error);
                        });

                    return deferred.promise;
                };


                return {
                    gdpByState: gdpByState
                }


            }]
        })

});

