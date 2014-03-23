define(['angular'], function(angular){


  angular.module('quiz.factories', [])
    .factory('myButtonFactory', function MyButtonFactory() {
      function ButtonIzer() {
        this.synced = {};
      }

      ButtonIzer.prototype = {
        constructor: ButtonIzer,
        setSync: function (value) {
          if (angular.isDefined(value)) {
            this.synced[value] = true
          } else {
            return this.synced;
          }
        },
        getSync: function (value) {
          return this.synced[value];
        },
        toggle: function (sync, value) {
          this.synced[sync] = value;
          return value;
        }
      };

      return new ButtonIzer();
    })


});