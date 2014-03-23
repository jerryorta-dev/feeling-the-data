define(['angular', 'quizFactories'], function(angular){


  angular.module('quiz.factories')
    .factory('quizDataFactory', ['$q', '$http', function QuizDataFactory($q, $http) {
      'use strict';

      var getData = function () {

        var deferred = $q.defer(dataUrl);

        // get uers data
        $http.get(dataUrl)
          .success(function (data) {
            deferred.resolve(data);
            return data;
          })
          .error(function (reason) {
            deferred.reject("Data does not exist!");
            return reason;
          });

        return deferred.promise;
      };

      return {
        getData: getData
      };
    }])


});