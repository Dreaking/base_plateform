(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CheckApplyThingController', CheckApplyThingController)
    .filter('NowTime', NowTime)
    function NowTime(){
      return function(input,params){
        return moment.unix(input).format('lll');
      }
    }
  CheckApplyThingController.$inject = ['$scope', 'ngDialog', 'schoolResourceApi'];

  function CheckApplyThingController($scope, ngDialog, schoolResourceApi) {
    var vm = this;
    $scope.passApply=function(id){
      ngDialog.openConfirm({
              template: 'passconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              schoolResourceApi.PassThingApply({room_apply_id:id},function(data){
                getList();
              })
            }, function (reason) {
      });
    }
    $scope.rejectApply=function(id){
      ngDialog.openConfirm({
              template: 'rejectconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              schoolResourceApi.RejectThingApply({room_apply_id:id}).$promise.then(function(){
                getList();
              })
            }, function (reason) {
      });
    }
    function getList(){
      schoolResourceApi.ApplyThingList(function(data){
        vm.applys=data.data;
      })
    }
    getList();
  }
})();