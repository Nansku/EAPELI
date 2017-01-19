angular.module('gamecomponentmodule', [
    'ngRoute',
    'ngAnimate'
]);

angular.
    module('gamecomponentmodule').
    component('gameComponent', {
        templateUrl: 'components/game-component-template.html',
        controller: ['$http','$routeParams','$location',
            function GameComponentController($http,$routeParams, $location) {
                var self = this;
                self.selectedButton;
                self.options = [];
                var index = parseInt($routeParams.optionId);
                self.nextpage = index+1;
                self.previouspage = index-1;
                self.answerCorrect = false;
                self.answerWrong = false;
                self.checkButtonClicked = false;

                $http.get('/api/questions')
                    .then(function (response) {
                    if (self.nextpage > response.data.length) {
                        $location.path('/!end');
                        return;
                    }
                    self.options.push(response.data[index].firstoption);
                    self.options.push(response.data[index].secondoption);
                    self.options.push(response.data[index].thirdoption);
                    self.image = response.data[index].imagename;
                    self.info = response.data[index].questioninfo;
                    self.answer = response.data[index].answer;
            });
            self.selectButton = function (option) {
                self.selectedButton = option;
            };

            self.nextPage = function () {
                self.answerCorrect = false;
                self.answerWrong = false;
                self.checkButtonClicked = false;

            };

            self.correctAnswer = function () {
                self.answerWrong = false;
                self.answerCorrect = true;
                self.checkButtonClicked = true;
            };

            self.wrongAnswer = function () {
                self.answerCorrect = false;
                self.answerWrong = true;
                self.checkButtonClicked = true;
            };

            self.isCheckButtonDisabled = function () {
                return self.selectedButton == undefined;

            };

            self.isPreviousButtonDisabled = function () {
                return index == 0;
            };

            self.isNextButtonDisabled = function () {
                return self.checkButtonClicked == false;
            }

        }
        ]
});
