/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .config(cookiesConfig)
    .controller('LoginController', LoginController);
  cookiesConfig.$inject = ['$cookiesProvider'];
  LoginController.$inject = ['$rootScope', '$scope', '$cookies', '$http', '$state', 'userResourceApi', 'USER_ROLES', 'AUTH_EVENTS'];

  function cookiesConfig($cookiesProvider){
    var date = new Date();
    $cookiesProvider.expires = date.setMinutes(date.getMinutes() + 20);
}
  function LoginController($rootScope, $scope, $cookies, $http, $state, userResourceApi, USER_ROLES, AUTH_EVENTS) {
    var vm = this;
    activate();
    $scope.logout = function() {
      removeSession();
      userResourceApi.logout(function(data) {
        $state.go('page.login');
      })
    }

    function setSession(id, role) {
      removeSession();
      $cookies.putObject('session', {
        sessionID: id,
        role: role
      })
    }

    function removeSession() {
      $cookies.remove('session');
    }

    function activate() {
      // bind here all data from the form
      vm.account = {};
      // place the message if something goes wrong
      vm.authMsg = '';

      vm.login = function() {
        vm.authMsg = '';
        if (vm.loginForm.$valid) {
          userResourceApi.login({
            username: vm.account.username,
            password: vm.account.password
          }).$promise.then(function(data) {
            if (data.status == 200) {
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data.data.type);
              setSession(1, data.data.type.toString())
              switch (data.data.type.toString()) {
                case USER_ROLES.baseadmin:
                  $state.go('admin.secondAdmin');
                  break;
                case USER_ROLES.admin:
                  $state.go('admin.userManagement');
                  break;
                case USER_ROLES.teamleader:
                  $state.go('team.teamworker');
                  break;
                case USER_ROLES.teamworker:
                  $state.go('team.team');
                  break;
                case USER_ROLES.visitor:
                  $state.go('visitor.info');
                  break;
                default:
                  $state.go('page.login');
              }
            } else {
              vm.authMsg = '账号名或密码错误';
            }
          })
        } else {
          vm.loginForm.account_username.$dirty = true;
          vm.loginForm.account_password.$dirty = true;
        }
      };
    }
  }
})();