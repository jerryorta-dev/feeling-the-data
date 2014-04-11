define(["angular", "app"], function (angular, app) {

    app.cons().SHOW_LOAD_ORDER = false;

    if (app.cons().SHOW_LOAD_ORDER) {
        console.log("configRoutes")
    }

    angular.module("ftd", [
            "ngRoute",
            "ui.router",
            "ngAnimate",
            "ui.bootstrap",
            "ftd.indeedJobsData",
            "ftd.controllersModule",
            "ftd.directivesModule",
            'ftd.indeedModule',
            'ftd.zillowData',
            'ftd.zillowMapMU',
            "ftd.filtersModule",
            'ftd.ip',
            'ftd.topojsonMapData',
            'ftd.bea']
    );

    angular.module("ftd")
        .constant("zillowApiKey", "X1-ZWz1dshk18nnyj_76gmj")
        .constant("truliaApiKey", "5kpnkmaued687936qm6y9chc")
        .constant("indeedApiKey", "4600389599611799")
        .constant("usaTodayApiKey", "474qrq8eh68cqa4hvw45tqfu")
        .constant("censusDataApiKey", "f136a395509816b3bda96f6a1375b3960f27cbbb")
        .constant("beaApiKey", "E5311C0F-5662-4934-B043-69BA533F9959")

    angular.module("ftd").config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {


            $urlRouterProvider.otherwise("/indeed");

            $stateProvider
                .state("indeed", {
                    url: "/indeed",
                    views: {
                        "@": {templateUrl: "app/partials/indeed.html",
                            controller: "MainAppController"}
                    }
                })
            /*.state("quiz.questions", {
             url: "", //do not deep link the actual quiz
             views: {
             "@": {templateUrl: "app/partials/quiz.questions.html",
             controller: "AnswerController"},
             "controls@quiz.questions": {templateUrl: "app/partials/quiz.questions.controls.html"},
             "question@quiz.questions": {templateUrl: "app/partials/quiz.questions.question.html"}
             }

             }).state("quiz.result", {
             url: "/result",
             views: {
             "@": {templateUrl: "app/partials/quiz.result.html",
             controller: "ResultController"},
             "controls@quiz.result": {templateUrl: "app/partials/quiz.result.controls.html"},
             "result@quiz.result": {templateUrl: "app/partials/quiz.result.current.html"}
             }
             })*/

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

    /**
     * Return root angular app to bootstrap in requirejs-config
     */
    return angular;
})