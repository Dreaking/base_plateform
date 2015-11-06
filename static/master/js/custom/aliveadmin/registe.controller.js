
(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$scope','$http', '$state','$timeout','md5','schoolResourceApi'];
    function RegisterController($scope,$http, $state,$timeout,md5,schoolResourceApi) {
        var vm = this,timer;
          // bind here all data from the form
          vm.account = {};
          vm.submited=false;
          vm.checkboxShow=true;
          vm.checkCode='';
          vm.code='';
          vm.account.phone='';
          vm.register={password:'',account_password_confirm:''};
          vm.time=0;
          // place the message if something goes wrong
          vm.authMsg = '';
          vm.getCheckCode=function(){
            vm.authMsg='';
            if(vm.account.phone!=''){
              vm.checkboxShow=false;
              if(vm.time<=0){
                vm.time=60;
                schoolResourceApi.SendCode({mobile:vm.account.phone},function(data){
                  console.log(data.status,typeof data.status)
                  $timeout(function(){
                  switch(data.status){
                  case 420:vm.authMsg ='该帐号已注册';break;
                  case 431:vm.authMsg ='验证码错误';break;
                  case 420:vm.authMsg='手机号不存在';break;
                  default:break;
                 }
                 console.log(vm.authMsg)
                 vm.registerForm.account_phone.$dirty = false;
                },0,true)
                })
                timer=setInterval(function(){if(vm.time!=0)$timeout(function(){vm.time--;},0,true);else{$timeout(function(){vm.checkboxShow=true;clearInterval(timer)},0,true);}},1000)
              }
            }          
            else
              document.querySelector('input[name=account_phone]').focus();
          }
          vm.register = function() {
            vm.authMsg = '';

            if(vm.registerForm.$valid) {
              schoolResourceApi.Register({mobile:vm.account.phone,verify_code:vm.checkCode,password:vm.register.password}).$promise.then(function(data){
                console.log(data)
                $timeout(function(){
                  switch(data.status){
                  case 420:vm.authMsg ='该帐号已注册';break;
                  case 431:vm.authMsg ='验证码错误';break;
                  case 420:vm.authMsg='手机号不存在';break;
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
              vm.registerForm.account_password.$dirty = true;
              vm.registerForm.account_agreed.$dirty = true;
              
            }
          };
    }
})();
