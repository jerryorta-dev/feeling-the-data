require.config(
    {"baseUrl": "app/",
        "paths": {
            'preprocess': "loader/preprocess",


            "angular": "vendors/angular-1.2.14/angular.min",
            "angularanimate": "vendors/angular-1.2.14/angular-animate.min",
            "uirouter": "vendors/uirouter-0.2.8/angular-ui-router.min",
            "angular-route": "vendors/angular-1.2.14/angular-route.min",
            "restangular": "vendors/restangular-1.3.1/restangular.min",
            "underscore": "vendors/underscore-1.6.0/underscore-min",
            "domReady": "vendors/requirejs-domready-2.0.1/domReady",



            "jquery": "vendors/jquery-2.1.0/jquery.min",
            "uibootstrap": "vendors/angular-ui-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min",

            //Angular Config
            "ngConfig": "ng/configRoutes",

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



            'preprocess': {
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

            "ngConfig": {
                "deps": [
                    "uibootstrap",
                    'restangular'
                ]
            }

        }


    });

/**
 * DO NOT INCLUDE ANGULAR CONFIG FILE -- ngConfig
 */
require([
        'domReady',

        "ngConfig",

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
    function (document, angular) {

        angular.bootstrap(document, ['app']);

    });