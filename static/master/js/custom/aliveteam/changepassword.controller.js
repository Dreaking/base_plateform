/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$http','$timeout', '$state','schoolResourceApi'];

  function ChangePasswordController($http,$timeout, $state,schoolResourceApi) {
    var vm = this;
    vm.account = {};
    vm.changePassword={};
    // place the message if something goes wrong
    vm.authMsg = '';

    vm.changePassword = function() {
      vm.authMsg = '';
      vm.successInfo='';
      if (vm.changePasswordForm.$valid) {
        schoolResourceApi.ChangeUserPassword({old_password:vm.account.old_password,new_password:vm.changePassword.password},function(data){
          switch(data.status){
            case 200:vm.successInfo='修改成功,请重新登录';$timeout(function(){$state.go('page.login')},3000,true);break;
            case 430:vm.authMsg='密码不正确';break;
            case 130:vm.authMsg='密码长度不合法';break;
            case 131:vm.authMsg='密码格式不合法';break;
            default:vm.authMsg='修改失败';break;
          }
        })
      } else {
        vm.registerForm.account_email.$dirty = true;
        vm.registerForm.account_password.$dirty = true;
        vm.registerForm.account_agreed.$dirty = true;

      }
    };
  }
})();