angular.module("ftd", [
        "ngRoute",
        "ui.router",
        "ngAnimate",
        "ui.bootstrap",
        'ftd.ui',
        "ftd.indeedJobsData",
        "ftd.controllersModule",
        "ftd.directivesModule",
        'ftd.indeedModule',
        'ftd.zillowData',
        'ftd.zillowMapMU',
        'ftd.beaD3Map',
        "ftd.filtersModule",
        'ftd.ip',
        'ftd.topojsonMapData',
        'ftd.bea',
        'ftd.jobMarketsResultsModule',
        'ftd.parsingCache',
        'ftd.servicesModule',
        'ftd.ui.toggleswitch']
);

_.each(apikeys.reference, function (value, key, list) {
    angular.module("ftd").constant(key, value);
});

angular.module("ftd").config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/indeed");

        $stateProvider
            .state("indeed", {
                url: "/indeed",
                views: {
                    "@": {templateUrl: "app/partials/job-market.html",
                        controller: "MainAppController"}
                }
            })
    }
])
    .run(["$rootScope", "$state", "$stateParams",
        function ($rootScope, $state, $stateParams) {

            // It"s very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes("contacts.list") }"> will set the <li>
            // to active whenever "contacts.list" or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);
