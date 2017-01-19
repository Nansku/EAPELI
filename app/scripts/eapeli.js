'use strict';

// Declare app level module which depends on views, and components
angular.module('eapeli', [
  'ngRoute',
  'ngAnimate',
  'maincomponentmodule',
  'gamecomponentmodule',
  'endcomponentmodule',
  'admincomponentmodule'
]).
config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.
      when('/', {
        template: '<main-component></main-component>'
      }).
      when('/game/:optionId', {
         template: '<game-component></game-component>'
      }).
      when('/!end', {
          template: '<end-component></end-component>'
      }).
      when('/admin', {
          template: '<admin-component></admin-component>'
      }).
      otherwise('/');

}]);

angular.module('admincomponentmodule',[
    'ngFileUpload'
]);

angular.
module('admincomponentmodule').
component('adminComponent', {
    templateUrl: 'components/admin/admin-component-template.html',
    controller: ['$http','Upload','$window',
        function AdminComponentController($http,Upload,$window){
        var self = this;
        self.responsemessage;
        self.errormessage;
        self.questions;
        self.errormessageGet;
        self.deletesuccess;
        self.deleteerror;


        self.submitForm = function (admin) {

            if (admin.$invalid) {
                return;
            }

            var options = {
              firstoption: self.firstoption,
              secondoption: self.secondoption,
              thirdoption: self.thirdoption,
              questioninfo: self.questioninfo,
              answer: self.answer
            };

            upload(self.file, options);
            console.log(admin);
            console.log(self.firstoption);
            console.log(self.secondoption);
            console.log(self.thirdoption);

        };
        self.deletequestion = function (question) {

            $http({
                method: 'DELETE',
                url: '/api/deletequestion',
                data: {
                    id: question._id
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function (response) {
                self.deletesuccess = true;
                for (var i = 0; i < self.questions.length; i++) {
                    if (self.questions[i]._id == question._id) {
                       self.questions.splice(i,1);
                        break;
                    }
                }
            }).catch (function (err) {
                self.deleterror = true;
            });
        };


        var upload = function (file, options) {
            Upload.upload({
                url: 'http://localhost:8000/api/uploadimage', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    options.imagename = resp.config.data.file.name;
                    $http.post("/api/questions", options)
                        .then(function (response) {
                            self.responsemessage = response.data;
                            self.firstoption = undefined;
                            self.secondoption = undefined;
                            self.thirdoption = undefined;
                            self.answer = undefined;
                            self.questioninfo = undefined;
                        }).catch(function (error) {
                        self.errormessage = error.data;
                    });
                } else {
                    $window.alert('an error occured');
                }
                $http.get("/api/questions")
                    .then(function (response) {
                        self.questions = response.data;
                        console.log(self.questions);
                    }).catch(function (error) {
                    self.errormessageGet = error.data;
                });
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                self.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });

        };



        $http.get("/api/questions")
            .then(function (response) {
                self.questions = response.data;
                console.log(self.questions);
            }).catch(function (error) {
                self.errormessageGet = error.data;
        });

    }]

});
angular.module('endcomponentmodule',[
    'ngRoute'
]);

angular.
    module('endcomponentmodule').
    component('endComponent', {
        templateUrl: 'components/end-component-template.html',
        controller: ['$http','$routeParams',
            function EndComponentController($http, $routeParams) {

}]
});
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

'use strict';

angular.module('maincomponentmodule',[]);

angular.
    module('maincomponentmodule').
    component('mainComponent', {
        templateUrl: 'components/main-component-template.html',
        controller: function MainComponentController() {

        }
        
});
