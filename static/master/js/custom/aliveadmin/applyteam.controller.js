(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('ApplyTeamController', ApplyTeamController)
  ApplyTeamController.$inject = ['$scope', '$timeout', '$state', 'schoolResourceApi', 'ngDialog', 'Upload']

  function ApplyTeamController($scope, $timeout, $state, schoolResourceApi, ngDialog, Upload) {
    var vm = this;
    $scope.authMsg = '';
    $scope.header = '';
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.file = null;
    vm.uploadFiles = function(file) {
      console.log(123456)
      if (file && !file.$error) {
        Upload.dataUrl(file, true).then(function(urls) {
          vm.file = urls.slice((urls.indexOf('base64,') + 7))
        });
      }
    }
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.openTimed = function(info) {
      var dialog = ngDialog.open({
        template: info,
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      setTimeout(function() {
        dialog.close();
      }, 2000);
    };
    vm.replyTeam = function() {
      vm.submitted = true;
      console.log(vm.formValidate.$valid, vm.file)
      if (!vm.file) {
        vm.openTimed('<p class="text-center text-danger">请上传团队文件</p>')
      } else if (vm.formValidate.$valid) {
        schoolResourceApi.ApplyNewTeam({
          team_name: vm.title,
          excel_file: vm.file,
          material: vm.content
        }).$promise.then(function(data) {
          switch (data.status) {
            case 440:
              $scope.header = '<span class="text-danger">注册失败<span>';
              $scope.authMsg = '团队名已存在';
              break;
            case 423:
              $scope.header = '<span class="text-danger">注册失败<span>';
              $scope.authMsg = '个人信息未完善';
              $timeout(function() {
                $state.go(visitor.info)
              });
              break;
            case 200:
              $scope.header = '<span class="text-success">注册成功<span>';
              $scope.authMsg = '申请成功，请耐心等候管理员审核，审核结果将会通过短信通知';
              break;
            default:
              break;
          }
          ngDialog.open({
            template: 'alert',
            className: 'ngdialog-theme-default',
            scope: $scope
          })
          $timeout(function() {
            vm.title = '';
            vm.content = '';
          }, 0, true)
        })
      } else {
        console.log('Not valid!!');
        return false;
      }
    }
  }
})();