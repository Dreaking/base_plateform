(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseNoticeController', BaseNoticeController)
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
  BaseNoticeController.$inject = ['schoolResourceApi', 'adminResourceApi','ngDialog', 'APP_PARMAS']

  function BaseNoticeController(schoolResourceApi, adminResourceApi,ngDialog, APP_PARMAS) {
    var vm = this;
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.notice = {
      title: '',
      content: '',
      type: 0
    }
    NoticeQuery();

    function NoticeQuery() {
      adminResourceApi.BaseInfoQuery({
        type: 0
      }, function(data) {
        vm.notices = data.data;
      })
    }
    vm.submitted = false;
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.delecteNotice = function(index, notice) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        schoolResourceApi.DelectInfo({
          notice_id: notice.notice_id
        }, function(data) {
          console.log(data);
        })
        vm.notices.splice(index, 1);
      }, function(reason) {});
    }
    vm.addNotice = function(notice) {
      console.log(notice)
      vm.submitted = true;
      if (vm.formValidate.$valid) {
        schoolResourceApi.BaseInfoAdd(notice, function(data) {
          vm.notice.title = '';
          vm.notice.content = '';
          vm.formValidate.title.$dirty = false;
          vm.formValidate.content.$dirty = false;
          vm.submitted = false;
          NoticeQuery();
        })
      } else {
        return false;
      }
    }
  }
})();