/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('SuportListController', SuportListController)
    .filter('NowTime', NowTime)
    .filter('statusFilter', statusFilter)
    function statusFilter(){
      return function(input,params){
        return input==0?'未审核':input==1?'已通过':'已否决';
      }
    }
    function NowTime(){
      return function(input,params){
        return moment.unix(input).format('lll');
      }
    }
  SuportListController.$inject = ['$scope', 'ngDialog', 'schoolResourceApi'];

  function SuportListController($scope, ngDialog, schoolResourceApi) {
    var vm = this;
    function getList(){
      schoolResourceApi.ApplyThingList(function(data){
        vm.applys=data.data;
      })
    }
    getList();
  }
})();