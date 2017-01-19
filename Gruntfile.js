module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            jslibraries: {
                src: [
                    "app/bower_components/angular/angular.js",
                    "app/bower_components/angular-animate/angular-animate.js",
                    "app/bower_components/angular-route/angular-route.js",
                    "app/bower_components/ng-file-upload/ng-file-upload.js",
                    "app/bower_components/jquery/dist/jquery.js",
                    "app/bower_components/bootstrap/dist/js/bootstrap.js"
                ],
                dest: "app/scripts/libraries.js"
            },
            jsapp: {
                src: [
                    "app/app.js",
                    "app/components/**/*.js"
                ],
                dest: "app/scripts/eapeli.js"
            },
            css: {
                src: [
                    "app/bower_components/bootstrap/dist/css/bootstrap.css",
                    "app/components/**/*.css",
                    "app/app.css",
                    "app/animations.css"

                ],
                dest: "app/styles/styles.css"
            }
        }
    });


    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat']);

};