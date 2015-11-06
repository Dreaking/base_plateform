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
    vm.typeList = {
      'out': [{
        item: '暂无类型',
        children: []
      }],
      'in': [{
        item: '暂无类型',
        children: []
      }]
    }
    vm.ColorRandom = function(i) {
      var color = ['timeline-badge primary', 'timeline-badge warning', 'timeline-badge danger', 'timeline-badge info', 'timeline-badge success'];
      return color[i];
    }
    vm.gotoEdit = function() {
      document.querySelector('input[name=amount]').focus();
    }
    vm.getTypeList = function() {
      schoolResourceApi.PaymentList(function(data) {
        vm.typeList = data.data ? angular.fromJson(data.data) : vm.typeList;
        vm.typeItems = vm.typeList[vm.todo.type];
        console.log(vm.typeItems)
        vm.firstType = vm.typeItems[0].item;
        vm.getSecondList();
      })
    }
    vm.getSecondList = function() {
      console.log(vm.typeItems)
      for (var i in vm.typeItems)
        if (vm.typeItems[i].item == vm.firstType)
          vm.secondTypeItems = vm.typeItems[i].children ? vm.typeItems[i].children : [{
            item: '暂无'
          }];
      vm.secondType = vm.secondTypeItems[0].item;
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
            data.data.flow_list[i].class = vm.ColorRandom(i % 5);
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
      vm.addTodo = function() {

        if (vm.todo.amount === '') return;
        if (!vm.todo.description) vm.todo.description = '';

        if (vm.editingTodo) {
          vm.todo = {};
          vm.editingTodo = false;
        } else {
          teamResourceApi.AddFlow({
            description: vm.todo.description,
            payment_type_name: vm.todo.type == 'out' ? '支出类型' : '收入类型' + ':' + vm.firstType + '-' + vm.secondType,
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