require.config(
    {'baseUrl': 'app/',
        'paths': {

            'app': 'preprocess',

            'angular': 'vendors/angular-1.2.14/angular',
            'angularanimate': 'vendors/angular-1.2.14/angular-animate.min',
            'uirouter': 'vendors/uirouter-0.2.8/angular-ui-router.min',
            'angular-route': 'vendors/angular-1.2.14/angular-route.min',
            'underscore': 'vendors/underscore-1.6.0/underscore-min',
            'domReady': 'vendors/requirejs-domready-2.0.1/domReady',
            'ua-parser': 'vendors/ua-parser-js-0.6.2/ua-parser.min',
            'jquery': 'vendors/jquery-2.1.0/jquery.min',
//            'bootstrap':'vendors/bootstrap-3.1.1/js/bootstrap.min',
            'uibootstrap': 'vendors/angular-ui-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min',
            'd3': 'vendors/d3-3.4.4/d3.min',
            'topojson': 'vendors/d3-3.4.4/topojson',

            'ineedjobsData': 'ng/data/indeedJobs',
            'ipData': 'ng/data/ipData',
            'd3MapDataJS': 'ng/data/d3MapData',
            'zillowData': 'ng/data/zillowData',
            'beaDataJs': 'ng/data/bea',

            'zmMashUp': 'ng/dataMashUp/zillowMapMU',
            'MUUSMapGDPByState': 'ng/dataMashUp/MUUSMapGDPByState',


            'ngConfig': 'ng/configRoutes',
            'controllersModule': 'ng/controllers/controllersModule',
            'JobMarketResults': 'ng/controllers/JobMarketResultsController',
            'directivesModule': 'ng/directives/directivesModule',
            'filtersModule': 'ng/filters/filtersModule',
//            'customDirective': 'ng/directives/customDirective/customDirective',
            'indeed': 'ng/directives/indeedSearchForm/indeedSearchForm',
            'd3Map': 'ng/directives/d3-map/d3-map'
        },
        'shim': {


            'app': {
                'exports': 'p',
                'deps': ['d3']
            },
            'domReady': {
                'deps': ['ngConfig']
            },
            'uirouter': {
                'deps': ['angular']
            },
            'angularanimate': {
                'deps': ['angular']
            },
            'angular': {
                'deps': ['jquery'],
                'exports': 'angular'
            },
            'angular-mocks': {
                'deps': ['angular']
            },
            'angular-resource': {
                'deps': ['angular']
            },
            'angular-route': {
                'deps': ['angular']
            },

            'underscore': {
                'exports': '_'
            },
//            'bootstrap':{
//              'deps':['jquery']
//            },

            'uibootstrap': {
                'deps': ['angular']
            },

            'ngConfig': {
                'deps': [
                    'uibootstrap',
                    'app'
                ]
            }

        }


    });

/**
 * DO NOT INCLUDE ANGULAR CONFIG FILE -- ngConfig
 */
require([
        'domReady',
        'angular',
        'angularanimate',
        'uirouter',
        'angular-route',
        'underscore',

        'ua-parser',
        'jquery',
        'uibootstrap',
        'd3',
        'topojson',

        'ineedjobsData',
        'ipData',
        'd3MapDataJS',
        'zillowData',
        'beaDataJs',

        'zmMashUp',
        'MUUSMapGDPByState',

        'ngConfig',
        'controllersModule',
        'directivesModule',
        'filtersModule',
        'JobMarketResults',
//    'customDirective',
        'indeed',
        'd3Map'
    ],
    function (document, angular) {

        angular.bootstrap(document, ['ftd']);

    });