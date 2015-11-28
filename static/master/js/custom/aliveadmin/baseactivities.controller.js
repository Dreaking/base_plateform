  (function() {
    'use strict';

    angular
      .module('app.controllers')
      .controller('BaseActivityController', BaseActivityController)
      .filter('NowTime', NowTime)
      .filter('removeTag', removeTag);

    function NowTime() {
      return function(input, params) {
        return moment.unix(input).format('ll');
      }
    }

    function removeTag() {
      return function(input, params) {
        input = input.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        input = input.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        input = input.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
        input = input.replace(/ /ig, '');
        return input;
      }
    }
    BaseActivityController.$inject = ['$timeout','$sce','schoolResourceApi', 'adminResourceApi','ngDialog', 'APP_PARMAS']

    function BaseActivityController($timeout,$sce,schoolResourceApi, adminResourceApi,ngDialog, APP_PARMAS) {
      var vm = this;
      vm.editorConfig = {
        initialFrameHeight: 300
      }
      vm.activity = {
        title: '',
        content: '',
        type: 2
      }
      loadActivityList();

      function loadActivityList() {
        adminResourceApi.BaseActivityQuery({
          type: 2
        }, function(data) {
          vm.activities = data.data;
        })
      }
      vm.downloadExcel = function(id) {
        schoolResourceApi.DownloadActivityExcel({
          activity_id: id
        }, function(data) {
          $timeout(function(){vm.exportUrl=$sce.trustAsResourceUrl(data.data.file_url);},0,true)
        })
      }
      vm.submitted = false;
      vm.validateInput = function(name, type) {
        var input = vm.formValidate[name];
        return (input.$dirty || vm.submitted) && input.$error[type];
      };
      vm.delecteActivity = function(index, activitie) {
        ngDialog.openConfirm({
          template: 'confirm',
          className: 'ngdialog-theme-default'
        }).then(function(value) {
          schoolResourceApi.DelectInfo({
            notice_id: activitie.notice_id
          }, function(data) {
            console.log(data);
          })
          vm.activities.splice(index, 1);
        }, function(reason) {});
      }
      vm.addActivity = function(activity) {
        vm.submitted = true;
        if (vm.formValidate.$valid) {
          schoolResourceApi.BaseInfoAdd(activity, function(data) {
            vm.activity.title = '';
            vm.activity.content = '';
            vm.formValidate.title.$dirty = false;
            vm.formValidate.content.$dirty = false;
            vm.submitted = false;
            loadActivityList();
          })
        } else {
          console.log('Not valid!!');
          return false;
        }
      }
    }
  })();