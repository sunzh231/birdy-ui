'use strict';

// Declare app level module which depends on views, and components
var managerApp = angular.module('managerApp', ['ngRoute']);

managerApp.config(['$routeProvider', function($routeProvider) {
      $routeProvider.
          when('/datatables',{
              controller: 'TableCtrl',
              templateUrl: function(params){
                  return 'app/view/tables/datatables.html';
              }
          }).
          when('/timeline',{
              controller: 'TableCtrl',
              templateUrl: function(params){
                  return 'app/view/UI/timeline.html';
              }
          }).
          when('/calendar',{
              controller: 'CalendarCtrl',
              templateUrl: function(params){
                  return 'app/view/calendar.html';
              }
          }).
          when('/:target/list',{
            controller: 'ListCtrl',
            templateUrl: function(params){
              return 'admin/'+params.target+'/list.html';
            }
          }).
          when('/:target/add',{
            controller: 'DetailCtrl',
            templateUrl: function(params){
              return 'admin/'+params.target+'/detail.html';
            }
          }).
          when('/:target/edit/:id',{
            controller: 'DetailCtrl',
            templateUrl: function(params){
              return 'admin/'+params.target+'/detail.html';
            }
          }).
          otherwise({
            redirectTo:'/a/main',
            controller: 'MainCtrl',
            templateUrl: function(params){
              return 'app/view/main.html';
            }
          });
}]);
