/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .factory('AuthService', ['$http','$cookieStore', 'USER_ROLES', function($http,$cookieStore, USER_ROLES) {
      var authService = {};
      authService.login = function(credentials) {

      };

      authService.isAllowRole=function(roles){
        var role=$cookieStore.get('session').role;
        if(!!!role)
          return false;
        return roles.indexOf(role)!==-1;
      }
      authService.isAuthenticated = function() {
        return !!$cookieStore.get('session');
      };

      authService.isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        if (authorizedRoles[0] == USER_ROLES.all)
          return true;
        return (authService.isAuthenticated()&&authService.isAllowRole(authorizedRoles));
      };
      return authService;
    }]);
})();