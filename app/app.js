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
