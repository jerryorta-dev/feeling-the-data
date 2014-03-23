define(['angular'], function (angular) {

    angular.module('quiz.controllers', []).
        controller('QuizController', ['$scope', 'Restangular', '$modal', '$log', 'ScoreCard', '$state', function ($scope, Restangular, $modal, $log, ScoreCard, $state) {

            //https://api.mongolab.com/api/1/databases/quizzes/collections/5322b780e4b04cf8bbe2026b?apikey=apvHnb1RnFOrJdrX6ur4Lmruo6z290PT

//        console.log(Restangular.all('quizzes'));
            Restangular.all('quizzes').getList().then(function (result) {
                $scope.quizzes = result;
            }, function (error) {
                console.log(error)
            });

            $scope.open = function (quiz) {
                $scope.selectedQuiz = quiz;

                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: ModalInstanceCtrl,
                    resolve: {
                        selectedQuiz: function () {
                            return $scope.selectedQuiz;
                        },
                        Restangular: function () {
                            return Restangular;
                        },
                        ScoreCard: function () {
                            return ScoreCard;
                        },
                        $state: function () {
                            return $state;
                        }
                    }
                });
            };

        }]).
        /*controller('QuizController', ['$scope','$http', 'MongoLab', 'mongoDocList', function ($scope, $http, MongoLab, mongoDocList) {

         console.log("quiz controller")
         //https://api.mongolab.com/api/1/databases/quizzes/collections/5322b780e4b04cf8bbe2026b?apikey=apvHnb1RnFOrJdrX6ur4Lmruo6z290PT
         MongoLab.all('list/' + mongoDocList).getList().then(function (result) {
         $scope.quizzes = result;
         }, function (error) {
         console.log(error)
         })

         }]).*/


        controller('AnswerController', ['$scope', 'ScoreCard', '$modal', '$rootScope', '$timeout', '$state', function ($scope, ScoreCard, $modal, $rootScope, $timeout, $state) {

            $scope.scorecard = ScoreCard;
            $scope.timePerQuestion = ScoreCard.timePerQuestion;
            $scope.doIncrement = true;
            $scope.currentQuestionObj = ScoreCard.getQuestion(0);

            //User has not answered yet
            $scope.answer = null;

            $scope.selectedAnswer = function (option) {
//                console.log(option);
                ScoreCard.setAnswer(option);
                $scope.answer = option;
            };

            $scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            $scope.isFirstQuestion = function() {
                if ($scope.currentQuestionObj.isFirstQuestion) {
                    return 'disabled';
                } else {
                    return 'active';
                }
            }

            $scope.previousQuestion = function() {
                //If user didn't answer, set as incorrect
                if ($scope.answer == null || $scope.currentQuestionObj.user == null || $scope.currentQuestionObj.user.answer == null) {
                    ScoreCard.setAnswer({
                        answer: null,
                        correct: false
                    });
                }

                //Reset user answer for next question
                $rootScope.answer = null;

                if (ScoreCard.isFirstQuestion()) {

                } else {
                    $scope.currentQuestionObj = ScoreCard.getQuestion(ScoreCard.currentQuestionNum - 1);
                    $scope.answer = null;

                }
            }


            $scope.nextQuestion = function (isClicked) {

                //If user didn't answer, set as incorrect
                if ($scope.answer == null) {
                    ScoreCard.setAnswer({
                        answer: null,
                        correct: false
                    });
                }

                //Reset user answer for next question
                $rootScope.answer = null;

                if (ScoreCard.isLastquestion()) {

                    $state.go('quiz.result');

                } else {


                    $scope.currentQuestionObj = ScoreCard.getQuestion(ScoreCard.currentQuestionNum + 1);

                    $scope.answer = null;

                    if (ScoreCard.mode == 'timed') {


                        if (isClicked) {
                            $scope.doIncrement = false;
                        } else {
                            $scope.doIncrement = true;
                        }

                        $scope.stopTimer();
                        $scope.safeApply($scope.startTimer());
                    }
                }
            };

            $rootScope.eventFired = 0;

            $scope.startTimer = function () {
                if (ScoreCard.mode == 'timed') {
                    $scope.$broadcast('timer-reset', 31);
                    $scope.$broadcast('timer-start');
                    $scope.timerRunning = true;
                    $scope.doIncrement = true;
                }
            };


            $scope.stopTimer = function () {
                $scope.$broadcast('timer-stop');
                $scope.timerRunning = false;
            };

            /**
             * Event fires twice... dunno why.
             * So $rootScope.eventFired is to keep track
             * if event has fired more than once, and if
             * it has, set timer for .25 seconds the reset
             * $rootScope.eventFired.
             *
             * This is a stupid hack.
             *
             * TODO do not use $rootScope.eventFired or $timeout
             */
            $scope.$on('timer-stopped', function (event, data) {
                $scope.timerRunning = false;
                if (ScoreCard.mode == 'timed' && !$rootScope.eventFired) {
                    $rootScope.eventFired++;
                    if ($scope.doIncrement) {
                        $scope.nextQuestion();
                    }
                }

                if ($rootScope.eventFired > 0) {
                    $timeout(function () {
                        $rootScope.eventFired = 0;
                    }, 250)
                }
            });

            $scope.open = function (ref) {
                $scope.referenceObject = ref;

                var modalInstance = $modal.open({
                    templateUrl: 'questionContent.html',
                    controller: ModalInstanceQuestionContentCtrl,
                    resolve: {
                        referenceObject: function () {
                            return $scope.referenceObject;
                        }
                    }
                });
            };

        }])
        .controller('ResultController', ['$scope', 'ScoreCard', '$modal', '$rootScope', '$timeout', '$state', function ($scope, ScoreCard, $modal, $rootScope, $timeout, $state) {
            $scope.scorecard = ScoreCard;

            $scope.results = ScoreCard.getResults();

            $scope.goToHome = function() {
                ScoreCard.reset();
                $state.go('quiz');
            }


            $scope.open = function (ref) {
                $scope.referenceObject = ref;

                var modalInstance = $modal.open({
                    templateUrl: 'questionContent.html',
                    controller: ModalInstanceQuestionContentCtrl,
                    resolve: {
                        referenceObject: function () {
                            return $scope.referenceObject;
                        }
                    }
                });
            };

        }]);

    // Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

    var ModalInstanceCtrl = function ($scope, $modalInstance, selectedQuiz, Restangular, ScoreCard, $state) {

        $scope.selectedQuiz = selectedQuiz;

        $scope.params = {time: '30', maxQuestions: '20', mode: 'timed'};
        $scope.takeQuiz = function (quiz, params) {
//            console.log(quiz)

            $modalInstance.close();

            Restangular.all(quiz.directory + '/package').getList().then(function (result) {
                ScoreCard.addQuiz(quiz, params, result).then(function (result) {
                    $state.go('quiz.questions', {
                        location: true,
                        reload: true
                    });
                })

            }, function (error) {
                console.log(error)
            })
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var ModalInstanceQuestionContentCtrl = function ($scope, $modalInstance, referenceObject) {

        $scope.reference = referenceObject.reference;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});