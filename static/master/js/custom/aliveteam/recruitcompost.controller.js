(function() {
    'use strict';

    angular
      .module('app.controllers')
      .controller('RecruitCmpostController', RecruitCmpostController)
    RecruitCmpostController.$inject = ['$scope', '$timeout', '$state', 'teamResourceApi', 'ngDialog']

    function RecruitCmpostController($scope, $timeout, $state, teamResourceApi, ngDialog) {
      var vm = this;
      $scope.authMsg = '';
      $scope.header = '';
      vm.validateInput = function(name, type) {
        var input = vm.formValidate[name];
        return (input.$dirty || vm.submitted) && input.$error[type];
      };
      vm.openTimed = function (info) {
            var dialog = ngDialog.open({
              template: info,
              plain: true,
              closeByDocument: false,
              closeByEscape: false
            });
            setTimeout(function () {
              dialog.close();
            }, 2000);
      };
      vm.newRecruit = function() {
        vm.submitted = true;
        if(vm.post.content==''){
          vm.openTimed('<p class="text-center">请填写招聘内容</p>')
        }
        else if (vm.formValidate.$valid) {
              teamResourceApi.AddRecruit(vm.post,function(data){
                if(data.status==200){
                  vm.openTimed('<h3 class="text-center text-success">发布成功</h3>');
                  $state.go('team.recruit');
                }
                else
                  vm.openTimed('<h3 class="text-center text-danger">发布失败</h3>')
              })
            } else {
              vm.openTimed('<p class="text-center text-danger">请填写必要信息</p>')
              return false;
            }
        }
      }
      })();