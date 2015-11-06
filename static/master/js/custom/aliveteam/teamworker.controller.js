/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('teamworkerController', teamworkerController)
    .filter('typeFormat', typeFormat)

  typeFormat.$inject = ['APP_PARMAS'];

  function typeFormat(APP_PARMAS) {
    return function(input, parmas) {
      return APP_PARMAS.TEAMROLENAME[input] || '';
    }
  }
  teamworkerController.$inject = ['$scope', '$timeout','ngDialog', '$filter', '$http', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'teamResourceApi', 'userResourceApi', 'APP_PARMAS'];

  function teamworkerController($scope, $timeout,ngDialog, $filter, $http, editableOptions, editableThemes, $q, schoolResourceApi, teamResourceAp, userResourceApi, APP_PARMAS) {
    var vm = this;
    vm.users = [];

    function getList() {
      userResourceApi.TeamWorkerQuery(function(data) {
        vm.users = data.data;
      })
    }
    getList()
    vm.types = [{
      id: 1,
      name: '次要负责人'
    }, {
      id: 2,
      name: '普通成员'
    }]
    vm.showRole = function(user) {
      if (user.type && vm.types.length) {
        var selected = $filter('filter')(vm.types, {
          id: user.type
        });
        return selected.length ? selected[0].name : '暂无';
      } else {
        return APP_PARMAS.TEAMROLENAME[user.type] || '暂无';
      }
    };

    vm.checkName = function(data) {
      if (!data || data == '') {
        return '姓名不能为空';
      }
    };
    vm.checkID = function(data) {
      if (!data) {
        return '请选择';
      }
    }
    vm.saveUser = function(data, type, id) {
        if (data.type > type)
          schoolResourceApi.DegradeTeamer({
            user_id: id
          }, function(data) {
            getList()
          })
        else if (data.type < type)
          schoolResourceApi.UpgradeTeamer({
            user_id: id
          }, function(data) {
            getList()
          })
        else
          return;
      }
      // remove user
    vm.removeUser = function(index, id) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        schoolResourceApi.DeleteTeamer({
          user_id: id
        }, function() {
          getList()
        });

      }, function(reason) {});
    };


    // editable table
    // ----------------------------------- 

    // filter users to show
    vm.filterUser = function(user) {
      return user.isDeleted !== true;
    };

    // mark user as deleted
    vm.deleteUser = function(id) {
      var filtered = $filter('filter')(vm.users, {
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
      vm.users.pop();
    };
  }
})();