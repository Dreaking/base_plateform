/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamListController', TeamListCtrlFn);

  TeamListCtrlFn.$inject = ['$scope', '$filter', '$http', 'ngDialog', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'adminResourceApi', 'APP_PARMAS'];

  function TeamListCtrlFn($scope, $filter, $http, ngDialog, editableOptions, editableThemes, $q, schoolResourceApi, adminResourceApi, APP_PARMAS) {
    var vm = this;
    vm.states = [{
      id: false,
      name: '软性入驻'
    }, {
      id: true,
      name: '硬性入驻'
    }]

    function getTeamList() {
      adminResourceApi.TeamListQuery(function(data) {
        vm.teams = data.data;
      })
    }
    vm.saveUser = function(data, id) {
      console.log(data, id)
      adminResourceApi.TeamSettleEdit({
        team_id: id,
        type: data.type ? 1 : 0
      }).$promise.then(function(data) {
        console.log(data);
      })
    }
    getTeamList();
    vm.removeTeam = function(name,id) {
      ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default',
              data:{name:name},
              controller:['$scope',function(scope){
                scope.deletedTeam=scope.ngDialogData.name;
              }]
            }).then(function (value) {
              adminResourceApi.RemoveTeam({team_id:id},function(data){
                getTeamList();
              });
            }, function (reason) {
      });
    }
    vm.showStates = function(user) {
      if (user.is_settled && vm.states.length) {
        var selected = $filter('filter')(vm.states, {
          id: user.is_settled
        });
        return selected.length ? selected[0].name : '暂无数据';
      } else {
        if (user.is_settled)
          return APP_PARMAS.TEAMSTATE[1] || '暂无数据';
        return APP_PARMAS.TEAMSTATE[0] || '暂无数据';
      }
    };

    vm.filterUser = function(user) {
      return user.isDeleted !== true;
    };

    // mark user as deleted
    vm.deleteUser = function(id) {
      var filtered = $filter('filter')(vm.teams, {
        id: id
      });
      if (filtered.length) {
        filtered[0].isDeleted = true;
      }
    };

    // cancel all changes
    vm.cancel = function(rowform) {
      console.log('cancel')
      rowform.$cancel();
      vm.teams.pop();
    };
  }
})();