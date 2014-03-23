define(['angular', 'preprocess'], function (angular, preprocess) {

    //Add 'ngRoute' to dependency injection array
//  var di = projectConfig.deps;
//  di.push('ngRoute');

//console.log(di)
    angular.module("app", [
        "ngRoute",
        "ui.router",
        "ngAnimate",
        'ui.bootstrap',
        "restangular",
        "app.controllersModule"]).
        config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider',
            function ($stateProvider, $urlRouterProvider, RestangularProvider) {

                RestangularProvider.setBaseUrl(preprocess.getRestangularPath('app/data'));
                RestangularProvider.setRequestSuffix('.json');

                RestangularProvider.addResponseInterceptor(function (response, operation) {
                    if (operation === 'getList') {

                        var newResponse = response.data;
                        return newResponse;
                    }
                    return response;
                });

                $urlRouterProvider.otherwise("/home");

                $stateProvider
                    .state('home', {
                        url: "/",
                        views: {
                            "@": {templateUrl: "app/partials/home.html",
                                controller: 'MainAppController'}
                        }
                    })
                    /*.state('quiz.questions', {
                        url: "", //do not deep link the actual quiz
                        views: {
                            "@": {templateUrl: "app/partials/quiz.questions.html",
                                controller: 'AnswerController'},
                            "controls@quiz.questions": {templateUrl: "app/partials/quiz.questions.controls.html"},
                            "question@quiz.questions": {templateUrl: "app/partials/quiz.questions.question.html"}
                        }

                    }).state('quiz.result', {
                        url: "/result",
                        views: {
                            "@": {templateUrl: "app/partials/quiz.result.html",
                                controller: 'ResultController'},
                            "controls@quiz.result": {templateUrl: "app/partials/quiz.result.controls.html"},
                            "result@quiz.result": {templateUrl: "app/partials/quiz.result.current.html"}
                        }
                    })*/

            }

        ])
        .run(['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {

                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }]);

    /**
     * Return root angular app to bootstrap in requirejs-config
     */
    return angular;
})