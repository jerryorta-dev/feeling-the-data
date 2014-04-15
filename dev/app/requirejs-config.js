require.config(
    {'baseUrl': 'app/',
        'paths': {

            'loadFilePreprocess': 'preprocess',

            'loadFileAngular': 'vendors/angular-1.2.14/angular',
            'loadFileAngularAnimate': 'vendors/angular-1.2.14/angular-animate.min',
            'loadFileUiRouter': 'vendors/uirouter-0.2.8/angular-ui-router.min',
            'loadFileAngularRoute': 'vendors/angular-1.2.14/angular-route.min',
            'loadFileUnderscore': 'vendors/underscore-1.6.0/underscore-min',
            'loadFileDomReady': 'vendors/requirejs-domready-2.0.1/domReady',
            'loadFileUaParser': 'vendors/ua-parser-js-0.6.2/ua-parser.min',
            'loadFileJQuery': 'vendors/jquery-2.1.0/jquery.min',
            'loadFileUiBootstrap': 'vendors/angular-ui-bootstrap-0.10.0/ui-bootstrap-tpls-0.10.0.min',
            'loadFileD3': 'vendors/d3-3.4.4/d3.min',
            'loadFileTopoJson': 'vendors/d3-3.4.4/topojson',

            'loadFileIndeedJobs': 'ng/data/indeedJobs',
            'loadFileIpData': 'ng/data/ipData',
            'loadFileD3MapData': 'ng/data/d3MapData',
            'loadFileZillowData': 'ng/data/zillowData',
            'loadFileBea': 'ng/data/bea',

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


            'loadFilePreprocess': {
                'exports': 'p',
                'deps': ['loadFileD3']
            },
            'loadFileDomReady': {
                'deps': ['ngConfig']
            },
            'loadFileUiRouter': {
                'deps': ['loadFileAngular']
            },
            'loadFileAngularAnimate': {
                'deps': ['loadFileAngular']
            },
            'loadFileAngular': {
                'deps': ['loadFileJQuery'],
                'exports': 'angular'
            },
            'angular-mocks': {
                'deps': ['loadFileAngular']
            },
            'angular-resource': {
                'deps': ['loadFileAngular']
            },
            'loadFileAngularRoute': {
                'deps': ['loadFileAngular']
            },

            'loadFileUnderscore': {
                'exports': '_'
            },
//            'bootstrap':{
//              'deps':['loadFileJQuery']
//            },

            'loadFileUiBootstrap': {
                'deps': ['loadFileAngular']
            },

            'ngConfig': {
                'deps': [
                    'loadFileUiBootstrap',
                    'loadFilePreprocess'
                ]
            }

        }


    });

/**
 * DO NOT INCLUDE ANGULAR CONFIG FILE -- ngConfig
 */
require([
        'loadFileDomReady',
        'loadFileAngular',
        'loadFileAngularAnimate',
        'loadFileUiRouter',
        'loadFileAngularRoute',
        'loadFileUnderscore',

        'loadFileUaParser',
        'loadFileJQuery',
        'loadFileUiBootstrap',
        'loadFileD3',
        'loadFileTopoJson',

        'loadFileIndeedJobs',
        'loadFileIpData',
        'loadFileD3MapData',
        'loadFileZillowData',
        'loadFileBea',

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