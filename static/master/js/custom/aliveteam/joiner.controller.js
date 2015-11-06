/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('JoinerController', JoinerController)
    .filter('typeFormat', typeFormat)
  typeFormat.$inject = ['APP_PARMAS'];

  function typeFormat(APP_PARMAS) {
    return function(input, parmas) {
      return APP_PARMAS.TEAMROLENAME[input] || '';
    }
  }
  JoinerController.$inject = ['$scope', '$timeout', 'ngDialog', '$http', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'teamResourceApi', 'userResourceApi', 'APP_PARMAS'];

  function JoinerController($scope, $timeout, ngDialog, $http, editableOptions, editableThemes, $q, schoolResourceApi, teamResourceApi, userResourceApi, APP_PARMAS) {
    var vm = this;
    $scope.passApply = function(id) {
      ngDialog.openConfirm({
        template: 'passconfirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        teamResourceApi.PassNewWorker({
          request_id: id
        }, function(data) {
          getTeamList();
        })
      }, function(reason) {});
    }
    $scope.rejectApply = function(id) {
      ngDialog.openConfirm({
        template: 'rejectconfirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        teamResourceApi.RejectNewWorker({
          request_id: id
        }).$promise.then(function() {
          getTeamList();
        })
      }, function(reason) {});
    }
    getTeamList();
    function getTeamList(){
      teamResourceApi.JoinerQuery(function(data) {
        vm.joiners = data.data;
        // vm.joiners=[{request_id:1,user_id:1,name:"小明",recruit_id:1,title:"招聘标题",mobile:"12345678901",qq:"123466"}];
        console.log(vm.joiners)
      })
    }

  }
})();