/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseTeamRecordController', BaseTeamRecordController)
    .filter('NowTime', NowTime)
    .filter('TypeFilter', TypeFilter)
    .filter('MoneyFilter', MoneyFilter);

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('l');
    }
  }
  function MoneyFilter() {
    return function(input, params) {
      return input > 0 ? '+' + input : input;
    }
  }

  function TypeFilter() {
    return function(input, params) {
      return input == 0 ? '管理员加钱' : input == 1 ? '管理员扣钱' : '团队支出';
    }
  }

  BaseTeamRecordController.$inject = ['$scope', '$timeout', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'schoolResourceApi', 'teamResourceApi', 'adminResourceApi'];

  function BaseTeamRecordController($scope, $timeout, DTOptionsBuilder, DTColumnDefBuilder, schoolResourceApi, teamResourceApi, adminResourceApi) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2).notSortable(),
      DTColumnDefBuilder.newColumnDef(3).notSortable(),
      DTColumnDefBuilder.newColumnDef(4)
    ];
    vm.exportExcel = function() {
      teamResourceApi.ExportFlowExecl({
        team_id: $scope.selectTeam,
        start_date: vm.starttimeunix,
        end_date: vm.endtimeunix
      }, function(data) {
        window.open(data.data.file_url);
      })
    }
    vm.checkChange = function() {
      vm.starttimeunix = new Date(new Date(vm.starttime).getFullYear() + '-' + (new Date(vm.starttime).getMonth() + 1)).getTime() / 1000,
        vm.endtimeunix = new Date(new Date(vm.endtime).getFullYear() + '-' + (new Date(vm.endtime).getMonth() + 1)).getTime() / 1000;
      if (!vm.starttimeunix || !vm.endtimeunix || vm.starttimeunix >= vm.endtimeunix)
        getRecordListWithOutTime($scope.selectTeam);
      else
        getRecordListWithTime($scope.selectTeam, vm.starttimeunix, vm.endtimeunix)
    }
    vm.changeList = function() {
      getRecordListWithOutTime($scope.selectTeam)
    }
    activate();

    function activate() {

      schoolResourceApi.TeamQuery(function(data) {
        vm.teams = data.data;
        $scope.selectTeam = data.data[0].team_id;
        getRecordListWithOutTime(data.data[0].team_id)
      })
    }

    function getRecordListWithTime(id, start, end) {
      schoolResourceApi.AdminRecordQuery({
        team_id: id,
        start_date: start,
        end_date: end,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }

    function getRecordListWithOutTime(id) {
      schoolResourceApi.AdminRecordQuery({
        team_id: id,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        vm.records = data.data.record_list;
      })
    }
    vm.clear = function() {
      vm.apply.endtime = '';
      vm.apply.starttime = '';
    };

    // Disable weekend selection
    vm.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    vm.toggleMin = function() {
      vm.minDate = vm.minDate ? null : new Date();
    };
    vm.toggleMin();

    vm.startopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.startopened = true;
      }, 0, true)
    };
    vm.endopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $timeout(function() {
        vm.endopened = true;
      }, 0, true)
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
    vm.dateOptions = {
      formatYear: '@',
      startingDay: 1,
      navigationAsDateFormat: true
    };
    vm.initDate = new Date('2019-10-20');
    vm.format = 'yyyy年-MM月';
  }
})();