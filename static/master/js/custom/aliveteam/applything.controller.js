(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('ApplyThingController', ApplyThingController);

  ApplyThingController.$inject = ['$scope', '$http', '$timeout', '$state', 'teamResourceApi','schoolResourceApi', 'ngDialog'];

  function ApplyThingController($scope, $http, $timeout, $state, teamResourceApi,schoolResourceApi, ngDialog) {
    var vm = $scope,
    NOW=new Date();
    vm.apply = {
      applything: {name:'',id:''},
      endtime:null,
      starttime:null,
      startMinue:NOW,
      endMinue:NOW
    };
    vm.apply.hstep = 1;
    vm.apply.mstep = 15;

    vm.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };
    vm.ismeridian = true;
    vm.getRoomList=function(){
      schoolResourceApi.PlaceQuery().$promise.then(function(data){
        console.log(data);
        vm.roomLists=data.data;
        console.log(vm.roomLists)
      })
    }
    vm.toggleMode = function() {
      vm.ismeridian = !vm.ismeridian;
    };
    vm.update = function() {
      var d = new Date();
      d.setHours(14);
      d.setMinutes(0);
      vm.mytime = d;
    };

    vm.getRoomList()
    vm.setApplyThing = function(room) {
      $timeout(function(){
      vm.apply.applything.name = room.name;
      vm.apply.applything.id = room.id;
      },0,true)
    }
    vm.clear = function() {
      vm.apply.endtime = '';
      vm.apply.starttime = '';
      vm.apply.startMinue=null;
      vm.apply.endMinue=null;
    };
    vm.toggleMin = function() {
      vm.minDate = vm.minDate ? null : new Date();
    };
    vm.toggleMin();
    vm.startdisabled = function(date, mode) {
      return (mode === 'day' && (date.getTime() < (new Date().getTime())));
    };
    vm.enddisabled = function(date, mode) {
      return (mode === 'day' && (date.getTime() <= (new Date().getTime())));
    };
    vm.startopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.apply.startopened = true;
    };
    vm.endopen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      console.log('open')
      vm.apply.minDate = vm.apply.starttime ? new Date(vm.apply.starttime) : new Date();
      vm.apply.endopened = true;
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
    vm.finishApply = function() {
      var starttime = Math.round(new Date(vm.apply.starttime).getTime() / 1000) + (new Date(vm.apply.startMinue).getHours()) * 3600 + (new Date(vm.apply.startMinue).getMinutes()) * 60,
        endtime = Math.round(new Date(vm.apply.endtime).getTime() / 1000) + (new Date(vm.apply.endMinue).getHours()) * 3600 + (new Date(vm.apply.endMinue).getMinutes()) * 60;
      if (starttime < endtime && vm.apply.applything != '')
        teamResourceApi.ApplyForThing({
          place_id: vm.apply.applything.id,
          start_time: starttime,
          end_time: endtime
        }, function(data) {
          if (data.status == 200)
            vm.openTimed('<h3 class="text-center text-success">申请成功</h3><p class="text-center">请耐心等候管理员审批</p>')
          $timeout(function() {
            $state.go('team.suportlist')
          }, 2000, true)
        })
      else
        vm.openTimed('<h3 class="text-center">时间填写有误</h3><p class="text-center">请认真核对起止时间，开始使用时间不能大于停止使用时间</p>')
    }
    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    vm.initDate = new Date('2019-10-20');
    vm.format = 'yyyy年-MM月-dd日';
  }
})();