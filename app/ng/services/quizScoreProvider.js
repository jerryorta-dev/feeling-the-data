define(['angular', "quizServices"], function (angular) {
    angular.module('quiz.services')
        .provider('quizScoreProvider', function QuizScoreProvider() {

            var quizEng;

            function QuizEngine(quizData, configData) {
                this.data = quizData;
                this.config = configData;
                this.name = this.config.name;
                this.timePerQuestion = this.config.timePerQuestion;
                this.numberOfQuestions = 0;
                this.quizCompleted = false;
                this.currentQuestionNum = 1;
                this.currentQuestionObj = {};
                this.lastQuestion = false;


                //Number of questions to get correct to pass.
                this.passing = 0;
                this.init();

            }

            QuizEngine.prototype = {
                constructor: QuizEngine,

                init: function () {
                    var prop;

                    for (prop in this.data.questions) {
                        var answerList = [];

                        for (var a in this.data.questions[prop].a) {
                            answerList.push(this.data.questions[prop].a[a]);
                        }

                        this.data.questions[prop]['answerList'] = answerList;

                        this.numberOfQuestions++;
                    }

                    this.passing = Math.ceil((this.config.passingScore / 100) * this.numberOfQuestions);
                },
                reset: function () {
                    this.currentQuestionNum = 1;
                    this.lastQuestion = false;
                },
                getQuestion: function (value) {
                    if (value == 'previous') {
                        if ( !((this.currentQuestionNum - 1) < 1)) {
                            console.log(this.currentQuestionNum);
                            this.currentQuestionNum--;
                            return 'q' + this.currentQuestionNum;
                        } else {
                            return 'beginning';
                        }
                    }

                    if (value == 'next') {
                        if ((this.currentQuestionNum + 1) <= this.numberOfQuestions) {
                            this.currentQuestionNum++;
                            this.isLastQuestion();
                            return 'q' + this.currentQuestionNum;
                        } else {
                            return 'end';
                        }
                    }




                },
                isLastQuestion: function () {
                    if (this.currentQuestionNum >= this.numberOfQuestions) {
                        this.lastQuestion = true;
                        return true;
                    } else {
                        return false;
                    }
                },
                getCurrentQuestion: function (num) {
                    return this.data.questions['q' + num];
                }
            };

            this.$get = ['$q', 'quizDataFactory', 'quizConfigFactory', function quizSoreProvider($q, quizDataFactory, quizConfigFactory) {

                var deferred = $q.defer();
                var quizData;
                var quizConfig;

                quizDataFactory.getData().then(function (data) {
                    quizData = data;

                    quizConfigFactory.getData().then(function (config) {
                        quizConfig = config;
                        deferred.resolve(new QuizEngine(data, config));
                    }, function (error) {
                        deferred.reject("No config loaded!");
                    });


                }, function (error) {
                    console.log(error);
                    deferred.reject("No quiz data loaded!");
                });

                return deferred.promise;
            }]
        })

});