/**
 * Created by jerryorta on 3/14/14.
 */
define(['loadFileUnderscore'], function (_) {


    var APIKeys = (function () {

        var constants = {
            VERSION: 1.0,
            TYPE: 'calculate'
        };

        this.constant = function (key) {
            return constants[key];
        };
        
        var keyList = [
            {
                name:'zillowApiKey',
                key:'X1-ZWz1dshk18nnyj_76gmj'
            },
            {
                name:'truliaApiKey',
                key:'5kpnkmaued687936qm6y9chc'
            },
            {
                name:'indeedApiKey',
                key:'4600389599611799'
            },
            {
                name:'usaTodayApiKey',
                key:'474qrq8eh68cqa4hvw45tqfu'
            },
            {
                name:'censusDataApiKey',
                key:'f136a395509816b3bda96f6a1375b3960f27cbbb'
            },
            {
                name:'beaApiKey',
                key:'E5311C0F-5662-4934-B043-69BA533F9959'
            }
        ];

        this.getList = function () {
            return keyList;
        };

        return function () {

        };

    })();

    APIKeys.prototype.cons = function () {
        return {
            VERSION: constant('VERSION'),
            TYPE: constant('TYPE')
        }
    };

    APIKeys.prototype.api = function(key) {
        var result = {
            name:'',
            key:''
        };

        _.each(keyList, function (kValue, kIndex, list) {
            if (kValue.name == key) {
                this.name = kValue.name;
                this.key = kValue.key;
            }
        },result);

        return result;
    };

    APIKeys.prototype.list = function() {
        return getList();
    };



    var singletonInstance = null;

    var getApiKeys = function () {

        if (singletonInstance === null) {
            singletonInstance = new APIKeys();
        }

        return singletonInstance;
    }

//Return API
    return getApiKeys();

})
;