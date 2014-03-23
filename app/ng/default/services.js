define(['angular', 'underscore'], function (angular, _) {

    function ScoreCard() {

        this.questions = [];
        this.timePerQuestion;
        this.maxQuestions;
        this.quizMetaData;
        this.mode;
        this.directory;

        this.questionBank = [];
        this.quiz = [];

        this.currentQuestionNum = 0;

    }

    ScoreCard.prototype = {
        constructor: ScoreCard,
        reset: function () {
            this.questions = [];
            this.currentQuestionNum = 0;
            this.currentQuestionObj = null;
        },

        getResults: function () {
            var result = {
                correct: 0,
                wrong: 0,
                totalAnswers: this.quiz.length,
                categories:{}
            };

            //Get Categories
            var categories = [];

            _.each(this.quiz, function( ele, index, list) {
//                console.log(ele);
                  if (ele.user.isCorrect) {
                      result.correct = result.correct + 1;
                  } else {
                      result.wrong = result.wrong + 1;
                  }

                this.push(ele.category);
            }, categories);

            result.finalScorePercent = (result.correct / this.quiz.length) * 100;
            result.finalWrongPercent = (result.wrong / this.quiz.length) * 100;



            var flat = _.flatten(categories);

            _.each(flat, function(cat, index, catetoyItems) {
               result.categories[cat] = {
                   correct: 0,
                   wrong: 0
               };

                _.each(this, function( ele, index, list) {

                    if (_.contains(ele.category, cat)) {
                        if (ele.user.isCorrect) {
                            this.correct = this.correct + 1;
                        } else {
                            this.wrong = this.wrong + 1;
                        }
                    }

                }, result.categories[cat])

            }, this.quiz);

            _.each(result.categories, function( ele, index, result) {
                var total = ele.correct + ele.wrong;

                ele.finalScorePercent = (ele.correct / total) * 100;
                ele.finalWrongPercent = (ele.wrong / total) * 100;

            })


            return result;

        },

        isLastquestion: function () {
            return this.currentQuestionNum + 1 == this.maxQuestions;
        },

        isFirstQuestion: function () {
            return this.currentQuestionNum == 0;
        },

        getQuestion: function (questionNumber) {
//            console.log('quiz', this.quiz[questionNumber])
            this.currentQuestionNum = questionNumber;
            return this.quiz[questionNumber];
        },

        getNextQuestion: function () {
            this.currentQuestionNum++;
            return this.quiz[this.currentQuestionNum];
        },

        setAnswer: function (answer) {
            this.quiz[this.currentQuestionNum].user.answer = answer;
            this.quiz[this.currentQuestionNum].user.isCorrect = (this.quiz[this.currentQuestionNum].correctAnswer.correct == answer.correct);
        },


        addQuiz: function (quiz, params, questions) {

            this.timePerQuestion = params.time;
            this.maxQuestions = ((questions.length - 1) < params.maxQuestions) ? questions.length : params.maxQuestions;
            this.questions = questions;
            this.quizMetaData = quiz;
            this.mode = params.mode;
            this.directory = 'app/data/' + quiz.directory + '/reference/';


            this.createQuiz();

            return this.promise(this.quiz);
        },

        promise: function (result, reason) {
            return {
                then: function (fnResult, fnReject) {
                    fnResult.call(null, result);
                    if (fnReject && reason) {
                        fnReject.call(null, reason);
                    }
                }
            }
        },

        createQuiz: function () {

            var _directory = this.directory;

            function createAnswer(answer, correct, reference) {
                return {
                    answer: answer,
                    correct: correct,
                    reference: _directory + reference
                }
            }

            this.questionBank = _.sample(this.questions, this.maxQuestions);


            _.each(this.questionBank, function (ele, index, list) {
//                console.log(index, list)

                var question = {};
                question.question = ele.question;
                question.correctAnswer = createAnswer(ele.answer, true, ele.reference);
                question.reference = _directory + ele.reference;
                question.category = ele.category;
                question.route = ele.route;


                //Answers array
                question.answers = [];

                var clone = list.slice(0);

                //Remove correct answer from list
                clone.splice(index, 1);

                //create array of just answers
                var uniqueAnswerList = [];
                _.each(clone, function (ele, index, list) {
                    var isUnique = true;
                    _.each(this, function (lEle, lIndex, lList) {
                        if (lEle.answer == ele.answer) {
                            isUnique = false;
                        }
                    })

                    if (isUnique) {
                        this.push(ele);
                    }

                }, uniqueAnswerList);


                //make it uniques
                //Refactored above code instead of using this line
//                uniqueAnswerList = _.unique(uniqueAnswerList);

                //without the correct answer
//                uniqueAnswerList = _.without(uniqueAnswerList, question.correctAnswer.answer);
                uniqueAnswerList = _.reject(uniqueAnswerList, function (ele) {
                    return question.correctAnswer.answer == ele.answer;
                });

//                console.log(question.correctAnswer.answer, uniqueAnswerList)


                //Get random list of answers to add to answer bank
                var falseAnswers = _.sample(uniqueAnswerList, 3);

                //create answer objects
                _.each(falseAnswers, function (ele, index, list) {
//                    this.push({answer: ele.answer, correct: false, reference:_directory + ele.reference})
                    this.push(createAnswer(ele.answer, false, ele.reference));
                }, question.answers)

                //put all answers in final array
                question.answers.push(question.correctAnswer);

                //mix them up randomly
                question.answers = _.shuffle(question.answers);

                //create a holder for the user to answer
                question.user = {};
                question.user.selected; //which answer did user select
                question.user.correct; //is it right or wrong (true or false)

                question.isLastQuestion = false;
                question.isFirstQuestion = false;

                //Add to final quiz
                this.push(question);


            }, this.quiz);

            this.quiz[this.quiz.length - 1].isLastQuestion = true;
            this.quiz[0].isFirstQuestion = true;
//            console.log(this.quiz);
            return true;

        }
    };

    angular.module('quiz.services', []).
        value('version', '0.1').

        service('ScoreCard', ScoreCard);
    // Restangular service
    angular.module('quiz.services').factory('MongoLab', ['Restangular', 'mongoLabApiKey', function (Restangular, mongoLabApiKey) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('https://api.mongolab.com/api/1/databases/quizzes/collections');
            RestangularConfigurer.setDefaultRequestParams({apiKey: mongoLabApiKey});
            RestangularConfigurer.setRestangularFields({
                id: "_id"
            });

            RestangularConfigurer.addResponseInterceptor(function (response, operation) {
                if (operation === 'getList') {

                    var newResponse = response.data;
                    return newResponse;
                }
                return response;
            });
        });
    }]);


});

