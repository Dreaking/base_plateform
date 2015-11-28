(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamRecordController', TeamRecordController);

  TeamRecordController.$inject = ['$scope', '$anchorScroll', '$location', 'teamResourceApi', 'schoolResourceApi', 'ngDialog'];

  function TeamRecordController($scope, $anchorScroll, $location, teamResourceApi, schoolResourceApi, ngDialog) {
    var vm = this;
    vm.dateList = [];
    vm.secondType = vm.firstType = '暂无';
    vm.ColorRandom = function(i) {
      var color = ['timeline-badge primary', 'timeline-badge warning', 'timeline-badge danger', 'timeline-badge info', 'timeline-badge success'];
      return color[i];
    }
    vm.gotoEdit = function() {
      document.querySelector('input[name=amount]').focus();
    }
    vm.getTypeList = function() {
      schoolResourceApi.LayoutFlowAllQuery(function(data) {
        vm.incomeLists={}
        vm.payoutLists={}
        for(var i in data.data){
          if(data.data[i].type==0){
            if(data.data[i].sub_list.length>0)
            vm.incomeLists[data.data[i].name]=data.data[i].sub_list;
          }
          else if(data.data[i].type==1){
            if(data.data[i].sub_list.length>0)
            vm.payoutLists[data.data[i].name]=data.data[i].sub_list;
          }
        }
        vm.typeItems=vm.todo.type=='in'?vm.incomeLists:vm.payoutLists;
        console.log(vm.typeItems)
        vm.firstType=Object.keys(vm.typeItems)?Object.keys(vm.typeItems)[0]:'暂无'
        vm.getSecondList()
      })
    }
    vm.getSecondList = function() {
      vm.secondTypeItems=vm.typeItems[vm.firstType]?vm.typeItems[vm.firstType]:[]
      vm.secondType = vm.secondTypeItems.length>0?vm.secondTypeItems[0].layout_two_id:'暂无';
      console.log(vm.secondType)
    }
    activate();

    function activate() {
      function haskey(obj, key) {
        for (var i in obj) {
          if (i == key)
            return true;
        }
        return false;
      }
      vm.gotoTarget = function(event, target) {
        vm.selectDate = target;
        $location.hash(target);
        $anchorScroll();
      }
      vm.isEmpty = function(obj) {
        var i = 0;
        for (var key in obj) {
          ++i;
        }
        return !!!i;
      }

      function getList() {
        vm.items = {};
        vm.getTypeList();
        teamResourceApi.FlowListQuery({
          page_num: 1,
          page_size: 100
        }, function(data) {
          for (var i in data.data.flow_list) {
            data.data.flow_list[i].add_time = moment.unix(data.data.flow_list[i].add_time).format('L');
            data.data.flow_list[i].class = vm.ColorRandom(data.data.flow_list[i].layout_two_id % 5);
          }
          for (var i in data.data.flow_list) {
            if (haskey(vm.items, data.data.flow_list[i].add_time))
              vm.items[data.data.flow_list[i].add_time].push(data.data.flow_list[i]);
            else {
              vm.items[data.data.flow_list[i].add_time] = [];
              vm.dateList.push(data.data.flow_list[i].add_time);
              vm.items[data.data.flow_list[i].add_time].push(data.data.flow_list[i])
            }
          }
          vm.selectDate = vm.dateList[0];
        })
      }
      vm.editingTodo = false;
      vm.todo = {
        type: 'in',
        description: '',
        amount: ''
      };
      getList();
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
      vm.addTodo = function() {
        if (vm.todo.amount === '') return;
        if (!vm.todo.description) vm.todo.description = '';

        if (vm.editingTodo) {
          vm.todo = {};
          vm.editingTodo = false;
        }
        else if(vm.secondType=='暂无'){
          vm.openTimed('<h4 class="text-center text-info">请选择有效的级联</h4>')
        }
        else {
          teamResourceApi.AddFlow({
            description: vm.todo.description,
            layout_two_id: vm.secondType,
            amount: parseInt((vm.todo.type == 'in' ? '+' : '-') + vm.todo.amount)
          }, function(data) {
            getList();
          })
          vm.todo.amount = '';
          vm.todo.description = '';
        }
      };

      vm.editTodo = function(index, $event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.todo = vm.items[index].todo;
        vm.editingTodo = true;
      };

      vm.removeTodo = function(id) {
        ngDialog.openConfirm({
          template: 'confirm',
          className: 'ngdialog-theme-default'
        }).then(function(value) {
          teamResourceApi.DeleteFlow({
            flow_id: id
          }, function(data) {
            getList();
          })
        }, function(reason) {});
      };


      vm.totalCompleted = function() {
        return $filter('filter')(vm.items, function(item) {
          return item.complete;
        }).length;
      };

      vm.totalPending = function() {
        return $filter('filter')(vm.items, function(item) {
          return !item.complete;
        }).length;
      };

    }
  }
})();