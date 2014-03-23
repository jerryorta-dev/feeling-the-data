require.config(
    {"baseUrl": "app/",
        "paths": {
            'preprocess': "loader/preprocess",


            "angular": "vendors/angular-1.2.14/angular",
            "angularanimate": "vendors/angular-1.2.14/angular-animate",
            "uirouter": "vendors/uirouter-0.2.8/angular-ui-router.min",
            "angular-route": "vendors/angular-1.2.14/angular-route.min",
            "restangular": "vendors/restangular-1.3.1/restangular.min",
            "underscore": "vendors/underscore-1.6.0/underscore-min",
            "domReady": "vendors/requirejs-domready-2.0.1/domReady",

            /*
             "nvd3Directive": "vendors/angularjs-nvd3-directives-0.0.5-beta/angularjs-nvd3-directives.min",
             "d3": "vendors/d3-3.4.3/d3.min",
             "nvd3": "vendors/nvd3/nv.d3",
             */

            "jquery": "vendors/jquery-2.1.0/jquery.min",
            "uibootstrap": "vendors/angular-ui-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min",

            //Angular Config
            "ngConfig": "ng/ngConfigRoutes",

            //base angular modules
            "apiModule":"ng/api/apiModule",
            "constantsModule":"ng/constants/constantsModule",
            "controllersModule" : "ng/controllers/controllersModule",
            "directivesModule" : "ng/directives/directivesModule",
            "factoriesModule" : "ng/factories/factoriesModule",
            "filtersModule" : "ng/filters/filtersModule",
            "mockApiModule" : "ng/mockApi/mockApiModule",
            "providersModule": "ng/providers/providersModule",
            "routesModule" : "ng/routes/routesModule",
            "servicesModule":"ng/services/servicesModule",

            //Custom modules
            "customDirective" : "ng/directives/customDirective/customDirective"
        },
        "shim": {

            /*"d3": {
             "exports":"d3"
             },

             "nvd3": {
             "deps": ["d3"]
             },

             "nvd3Directive": {
             "deps": ["angular", "d3", "nvd3"]
             },*/

            'preprocess': {
                "deps": ["jquery", "underscore"],
                "exports":"p"
            },
            'domReady': {
                "deps": ['ngConfig']
            },
            "uirouter": {
                "deps": ["angular"]
            },
            "angularanimate": {
                "deps": ["angular"]
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

            //CSS Files
            "ngConfig": {
                "deps": [
                    "uibootstrap",
                    'restangular',
                    "css!styles/dist/css/app"
                ]
            }

        },

        //Requirejs CSS plugin, map all css files to use plugin. Prepend css paths with css!
        "map": {
            "*": {
                "css": "vendors/require-css-0.1.2/css.min"}
        }
    });

/**
 * DO NOT INCLUDE ANGULAR CONFIG FILE -- ngConfig
 */
require([
        'domReady',

        "angular",
        "angular-route",
        "angularanimate",
        "underscore",
        "restangular",
        "uibootstrap",
        "uirouter",

        "apiModule",
        "controllersModule",
        "constantsModule",
        "directivesModule",
        "factoriesModule",
        "filtersModule",
        "mockApiModule",
        "providersModule",
        "providersModule",
        "routesModule",
        "servicesModule",

        "customDirective"
        ],
    function (document) {

        angular.bootstrap(document, ['app']);

    });