(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('NestableController', NestableController);
  NestableController.$inject = ['schoolResourceApi', 'adminResourceApi', 'ngDialog']

  function NestableController(schoolResourceApi, adminResourceApi, ngDialog) {
    var vm = this;
    vm.type = 'in';
    vm.typeList = {
      'out': [{
        item: '建立级联后请移除该模块',
        children: []
      }],
      'in': [{
        item: '建立级联后请移除该模块',
        children: []
      }]
    }
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
    vm.getList = function() {
      schoolResourceApi.PaymentList(function(data) {
        vm.typeList = data.data ? angular.fromJson(data.data) : vm.typeList;
        vm.items = vm.typeList[vm.type];
      })
    }
    vm.getList();
    vm.typeChange = function() {
      vm.getList();
      console.log(vm.type)
    }
    vm.PaymentEdit = function(data) {
      adminResourceApi.PaymentEdit({
        payment_type_list: data
      }, function(data) {
        vm.openTimed('<h3 class="text-center text-success">保存成功</h3>')
      })
    }
    vm.unuseitems = [];
    vm.saveChange = function() {
      vm.typeList[vm.type] = vm.items;
      vm.PaymentEdit(angular.toJson(vm.typeList));
    }
    vm.addNest = function(item) {
      vm.unuseitems.push({
        item: item,
        children: []
      })
      vm.item = '';
    }
  }
})();