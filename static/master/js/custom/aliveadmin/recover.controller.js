
(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('RecoverController', RecoverController);

    RecoverController.$inject = ['$scope', '$state','schoolResourceApi'];
    function RecoverController($scope, $state,schoolResourceApi) {
        var vm = this;
          vm.resetPassword = function() {
            vm.authMsg = '';
            console.log(vm)
            if(vm.recoverForm.$valid) {
              schoolResourceApi.ForgetCode({mobile:vm.recoverForm.phone}).$promise.then(function(data){
                switch(data.status){
                  case 422:vm.authMsg = '手机号码不存在';break;
                  case 200:$state.go('page.changepassword');break;
                  default:vm.authMsg = '请输入正确的手机号码';break;
                }
              })
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.authMsg = '请输入正确的手机号码'
            }
          };
    }
})();
