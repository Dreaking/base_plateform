/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('Application', Application)

  Application.$inject = ['$rootScope', '$scope', '$location', '$http', '$state', 'userResourceApi', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService'];

  function Application($rootScope, $scope, $location, $http, $state, userResourceApi, USER_ROLES, AUTH_EVENTS, AuthService) {
    //--未登录--
    $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
       console.log('未登录')
        $state.go('page.login');
      })
      //--权限不足--
    $scope.$on(AUTH_EVENTS.notAuthorized, function() {
      console.log('权限不足')
        $state.go('page.login');
      })
      //--系统出错--
    $scope.$on(AUTH_EVENTS.systemError, function() {
      console.log('系统出错')
      $state.go('page.login');
    })
    $scope.$on('$stateChangeStart', function(event, toState) {
      var authorizedRoles = toState.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        if (AuthService.isAuthenticated()) {
          // user is not allowed
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        } else {
          // user not login in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
      }
    });
  }
})();