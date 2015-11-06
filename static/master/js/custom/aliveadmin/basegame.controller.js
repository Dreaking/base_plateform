(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseGameController', BaseGameController)
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
  BaseGameController.$inject = ['schoolResourceApi', 'adminResourceApi', 'ngDialog', 'APP_PARMAS']

  function BaseGameController(schoolResourceApi, adminResourceApi, ngDialog, APP_PARMAS) {
    var vm = this;
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.game = {
      title: '',
      content: '',
      type: 1
    }
    vm.GameQuery = function() {
      adminResourceApi.BaseGameQuery({
        type: 1
      }, function(data) {
        vm.games = data.data;
      })
    }
    vm.GameQuery();
    vm.submitted = false;
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.delecteGame = function(index, game) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        schoolResourceApi.DelectInfo({
          notice_id: game.notice_id
        }, function(data) {
          console.log(data);
        })
        vm.games.splice(index, 1);
      }, function(reason) {});
    }
    vm.addGame = function(game) {
      console.log(game)
      vm.submitted = true;
      if (vm.formValidate.$valid) {
        schoolResourceApi.BaseInfoAdd(game, function(data) {
          vm.game.title = '';
          vm.game.content = '';
          vm.formValidate.title.$dirty = false;
          vm.formValidate.content.$dirty = false;
          vm.submitted = false;
          vm.GameQuery();
        })
      } else {
        console.log('Not valid!!');
        return false;
      }
    }
  }
})();