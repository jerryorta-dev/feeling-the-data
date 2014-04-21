$script.ready('preload', function() {
    _.mixin({


        calcPluck: function (data, key) {
            if (key) {
                return _.pluck(data, key);
            }

            return data;
        },

        calcMin: function (data, key) {
            return _.min(this.calcPluck(data, key));
        },

        calcMax: function (data, key) {
            return _.max(this.calcPluck(data, key));
        },

        calcSum: function (data, key) {
            return _.reduce(this.calcPluck(data, key), function (memo, num) {
                return memo + num;
            }, 0);
        },

        calcAverage: function (data, key) {
            return this.sum(this.calcPluck(data, key)) / data.length;
        },

        calcMedian: function (data, key) {

            var values = this.calcPluck(data, key);

            values.sort(function (a, b) {
                return a - b;
            });

            var half = Math.floor(values.length / 2);

            if (values.length % 2)
                return values[half];
            else
                return (values[half - 1] + values[half]) / 2.0;
        },


        calculate: function (data, config) {


            var _rawData = this.calcPluck(data, config.key);

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
                calc.min = this.calcMin(_data);
            }

            if (config.max) {
                calc.max = this.calcMax(_data);
            }

            if (config.average) {
                calc.average = this.calcAverage(_data);
            }

            if (config.median) {
                calc.median = this.calcMedian(_data);
            }

            if (config.sum) {
                calc.sum = this.calcSum(_data);
            }

            if (config.zeroData) {
                return {
                    data: _rawData,
                    meta: calc
                }
            }

            return calc;
        }


    });
});