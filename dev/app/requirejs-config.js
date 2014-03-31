require.config(
  {"baseUrl": "app/",
    "paths": {
      'preprocess': "preprocess",
      "angular": "vendors/angular-1.2.14/angular",
      "angularanimate": "vendors/angular-1.2.14/angular-animate.min",
      "uirouter": "vendors/uirouter-0.2.8/angular-ui-router.min",
      "angular-route": "vendors/angular-1.2.14/angular-route.min",
      "restangular": "vendors/restangular-1.3.1/restangular.min",
      "underscore": "vendors/underscore-1.6.0/underscore-min",
      "domReady": "vendors/requirejs-domready-2.0.1/domReady",
      'ua-parser': "vendors/ua-parser-js-0.6.2/ua-parser.min",
      "jquery": "vendors/jquery-2.1.0/jquery.min",
      "uibootstrap": "vendors/angular-ui-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min",
      "d3": "vendors/d3-3.4.3/d3.min",
      "topojson": "vendors/d3-3.4.3/topojson",
      "ngConfig": "ng/configRoutes",
      "apiModule": "ng/api/apiModule",
      "constantsModule": "ng/constants/constantsModule",
      "controllersModule": "ng/controllers/controllersModule",
      "directivesModule": "ng/directives/directivesModule",
      "factoriesModule": "ng/factories/factoriesModule",
      "filtersModule": "ng/filters/filtersModule",
      "mockApiModule": "ng/mockApi/mockApiModule",
      "providersModule": "ng/providers/providersModule",
      "routesModule": "ng/routes/routesModule",
      "servicesModule": "ng/services/servicesModule",
      "customDirective": "ng/directives/customDirective/customDirective",
      "indeed": "ng/directives/indeedSearchForm/indeedSearchForm",
      "d3Map": "ng/directives/d3-map/d3-map"
    },
    "shim": {


      'preprocess': {
        "exports": "p"
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
    "d3",
    "topojson",
    "d3Map",
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
    "indeed",
    'ua-parser',
    "customDirective"

  ],
  function (document, angular) {

    angular.bootstrap(document, ['app']);

  });