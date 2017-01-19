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