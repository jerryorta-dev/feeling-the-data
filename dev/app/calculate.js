/**
 * Created by jerryorta on 3/14/14.
 */
define(["loadFileUnderscore"], function (_) {


    var Calculate = (function () {

        var constants = {
            VERSION: 1.0,
            TYPE: 'calculate'
        };

        this.constant = function (key) {
            return constants[key];
        };

        return function () {

        };

    })();

    Calculate.prototype.cons = function () {
        return {
            VERSION: constant('VERSION'),
            TYPE: constant('TYPE')
        }
    };


    Calculate.prototype.pluck = function (data, key) {
        if (key) {
            return _.pluck(data, key);
        }

        return data;
    }

    Calculate.prototype.min = function (data, key) {
        return _.min(this.pluck(data, key));
    };

    Calculate.prototype.max = function (data, key) {
        return _.max(this.pluck(data, key));
    };

    Calculate.prototype.sum = function (data, key) {
        return _.reduce(this.pluck(data, key), function (memo, num) {
            return memo + num;
        }, 0);
    };

    Calculate.prototype.average = function (data, key) {
        return this.sum(this.pluck(data, key)) / data.length;
    };

    Calculate.prototype.median = function (data, key) {

        var values = this.pluck(data, key);

        values.sort(function (a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];
        else
            return (values[half - 1] + values[half]) / 2.0;
    };


    Calculate.prototype.calculate = function (data, config) {


        var _rawData = this.pluck(data, config.key);

        var _data = [];


        /**
         * Clean up data.
         *
         * remove undefined and null values
         *
         * if number is a string, convert to a number
         */
        _.each(_rawData, function (value, index, list) {
            if (value != null && value != undefined) {

                if (typeof value === 'string') {
                    this.push(Number(value));
                } else {
                    this.push(value);
                }
            } else {
                if (config.zeroData) {
                    list[index] = 0;
                }
            }


        }, _data);


        var calc = {};

        if (config.min) {
            calc.min = this.min(_data);
        }

        if (config.max) {
            calc.max = this.max(_data);
        }

        if (config.average) {
            calc.average = this.average(_data);
        }

        if (config.median) {
            calc.median = this.median(_data);
        }

        if (config.sum) {
            calc.sum = this.sum(_data);
        }

        if (config.zeroData) {
           return {
               data:_rawData,
               meta:calc
           }
        }

        return calc;
    };




    var singletonInstance = null;

    var getCalculations = function () {

        if (singletonInstance === null) {
            singletonInstance = new Calculate();
        }

        return singletonInstance;
    }

//Return API
    return getCalculations();

})
;