define(['angular', 'quizFactories'], function(angular){


  angular.module('quiz.factories')
    .factory('quizConfigFactory', ['$q', '$http',  function QuizDataFactory($q, $http) {
      'use strict';

      var getData = function (dataUrl) {

        var deferred = $q.defer();

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