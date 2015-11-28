/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BaseTeamOrderController', BaseTeamOrderController)
    .filter('NowTime', NowTime)

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('l');
    }
  }
  BaseTeamOrderController.$inject = ['$scope', '$timeout','$sce', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'schoolResourceApi', 'teamResourceApi', 'adminResourceApi'];

  function BaseTeamOrderController($scope, $timeout,$sce, DTOptionsBuilder, DTColumnDefBuilder, schoolResourceApi, teamResourceApi, adminResourceApi) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
    vm.dtColumnDefs = [
      DTColumnDefBuilder.newColumnDef(0),
      DTColumnDefBuilder.newColumnDef(1),
      DTColumnDefBuilder.newColumnDef(2).notSortable(),
      DTColumnDefBuilder.newColumnDef(3),
      DTColumnDefBuilder.newColumnDef(4).notSortable(),
      DTColumnDefBuilder.newColumnDef(5)
    ];
    vm.exportExcel = function() {
      adminResourceApi.TeamRecordExport({
        team_id: $scope.selectTeam,
        start_date: vm.starttimeunix,
        end_date: vm.endtimeunix
      }, function(data) {
        $timeout(function(){vm.exportUrl=$sce.trustAsResourceUrl(data.data.file_url);},0,true)
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

    function getRecordListWithTime(id, start, end) {
      schoolResourceApi.TeamRecordList({
        team_id: id,
        start_date: start,
        end_date: end,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        for(var i in data.data.record_list){
         data.data.record_list[i].amount=data.data.record_list[i].layout_one_type==0?'+'+data.data.record_list[i].amount:'-'+data.data.record_list[i].amount;
        }
        vm.records = data.data.record_list;
      })
    }

    function getRecordListWithOutTime(id) {
      schoolResourceApi.TeamRecordList({
        team_id: id,
        page_num: 1,
        page_size: 1000
      }).$promise.then(function(data) {
        for(var i in data.data.record_list){
         data.data.record_list[i].amount=data.data.record_list[i].layout_one_type==0?'+'+data.data.record_list[i].amount:'-'+data.data.record_list[i].amount;
        }
        vm.records = data.data.record_list;
      })
    }
    vm.clear = function() {
      vm.apply.endtime = '';
      vm.apply.starttime = '';
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
      }, 1000);
    };
    $scope.dateOptions = {
      formatYear: '@',
      startingDay: 1,
      minMode:'month'
    };
    $scope.enddatemode={
      mode:'month'
    }
    $scope.startdatemode=angular.copy($scope.enddatemode)
    vm.format = 'yyyy年-MM月';
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
      $scope.selectTeam = toParams.id;
      getRecordListWithOutTime(toParams.id)
    });
  }
})();