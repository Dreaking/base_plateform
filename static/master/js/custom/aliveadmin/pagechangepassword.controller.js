
(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('PageChangePasswordController', PageChangePasswordController);

    PageChangePasswordController.$inject = ['$scope','$http', '$state','$timeout','schoolResourceApi'];
    function PageChangePasswordController($scope,$http, $state,$timeout,schoolResourceApi) {
        var vm = this,timer;
          vm.account = {phone:'',checkCode:'',password:'',account_password_confirm:''};
          vm.submited=false;
          vm.authMsg = '';
          vm.register = function() {
            vm.authMsg = '';
            vm.submited=true;
            if(vm.registerForm.$valid) {
              schoolResourceApi.ChangePasswordUseCode({mobile:vm.account.phone,verify_code:vm.account.checkCode,new_password:vm.account.password}).$promise.then(function(data){
                $timeout(function(){
                  switch(data.status){
                  case 420:vm.authMsg ='该帐号已注册';break;
                  case 431:vm.authMsg ='验证码错误';break;
                  case 422:vm.authMsg='帐号不存在';break;
                  case 200:vm.successMsg='注册成功';$timeout(function(){$state.go('page.login');},3000,true);break;
                  default:break;
                 }
                },0,true)
                
              })
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.registerForm.account_phone.$dirty = true;
              vm.registerForm.checkcode.$dirty = true;
              vm.registerForm.account_password.$dirty = true;
              
            }
          };
    }
})();
