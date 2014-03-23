require.config(
    {"baseUrl": "app/",
        "paths": {
            'preprocess': "utils/preprocesses",


            "angular": "imports/libraries/angular-1.2.14/angular",
            "angularanimate": "imports/libraries/angular-1.2.14/angular-animate",
            "uirouter": "imports/libraries/uirouter-0.2.8/angular-ui-router.min",
            "angular-route": "imports/libraries/angular-1.2.14/angular-route.min",
            "restangular": "imports/libraries/restangular-1.3.1/restangular.min",
            "underscore": "imports/libraries/underscore-1.6.0/underscore-min",
            "domReady": "imports/libraries/requirejs-domready-2.0.1/domReady",

            /*
            "nvd3Directive": "imports/libraries/angularjs-nvd3-directives-0.0.5-beta/angularjs-nvd3-directives.min",
            "d3": "imports/libraries/d3-3.4.3/d3.min",
            "nvd3": "imports/libraries/nvd3/nv.d3",
            */

            "jquery": "imports/libraries/jquery-2.1.0/jquery.min",
//            "bootstrap": "styles/dist/js/quiz.min",
            "uibootstrap": "imports/libraries/angular-ui-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min",
            "timer": "imports/libraries/angular-timer-1.0.12/angular-timer",

            //default
            "quizConfig": "ng/default/ngConfig",
            "quizControllers": "ng/default/controllers",
            "quizFilters": "ng/default/filters",
            "quizDirectives": "ng/default/directives",
            "quizServices": "ng/default/services",

            //Services
            "quizFactories": "ng/services/factories",
            "quizDataFactory": "ng/services/quizDataFactory",
            "quizConfigFactory": "ng/services/quizConfigFactory",
            "quizScoreProvider": "ng/services/quizScoreProvider",


            //Controllers
//            "quizAnswerController": "ng/controllers/quizAnswerController",
//            "quizScoreController": "ng/controllers/quizScoreController",

            //Directives
            "quizRouteButton": "ng/directives/quizRouteButton/quizRouteButton",
            "takeQuizButton": "ng/directives/takeQuizButton/takeQuizButton",
            "quizGetQuestion": "ng/directives/quizGetQuestion/quizGetQuestion"
        },
        "shim": {

            /*"d3": {
                "exports":"d3"
            },

            "nvd3": {
              deps: ["d3"]
            },

            "nvd3Directive": {
                deps: ["angular", "d3", "nvd3"]
            },*/

            'preprocess': {
                deps: ["jquery", "underscore"]
            },
            'domReady': {
                deps: ['quizConfig']
            },
            "uirouter": {
                deps: ["angular"]
            },
            "angularanimate": {
                deps: ["angular"]
            },
            "angular": {
                "deps": ["jquery"],
                "exports": "angular"
            },
            "angular-mocks": {
                "deps": ["angular"]
            },
            "angular-resource": {
                "deps": ["angular"]
            },
            "angular-route": {
                "deps": ["angular"]
            },

            "underscore": {
                "exports": "_"
            },
            "restangular": {
                "deps": ["angular", "underscore"]
            },
            "uibootstrap": {
                "deps": ["angular"]
            },
            "timer": {
                "deps": ["angular"]
            },

//            "bootstrap": {
//                "deps": ["jquery"]
//            },

            //CSS Files
            "quizConfig": {
                "deps": [
                    "uibootstrap",
                    'restangular',
                    "css!styles/dist/css/quiz"
                ]
            }

        },

        //Requirejs CSS plugin, map all css files to use plugin. Prepend css paths with css!
        "map": {
            "*": {
                "css": "imports/libraries/require-css-0.1.2/css.min"}
        }
    });

/**
 * DO NOT INCLUDE ANGULAR CONFIG FILE -- quizConfig
 */
require(['domReady',
//        "quizScoreController",
//        "quizAnswerController",
        "quizGetQuestion",
        "quizRouteButton",
        "takeQuizButton",
        "quizConfigFactory",
        "quizScoreProvider",
        "quizDataFactory",
        "angular",
        "angular-route",
        "angularanimate",
        "timer",
//        "angular-resource",
        "underscore",
//        "bootstrap",
        "restangular",
        "uibootstrap",
        "quizControllers",
        "quizDirectives",
        "quizFilters",
        "quizFactories",
        "quizServices",
        "uirouter"],
    function (document) {

        angular.bootstrap(document, ['quiz']);

    });