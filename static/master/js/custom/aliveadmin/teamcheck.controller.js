/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamCheckController', TeamCheckController)
    .filter('NowTime', NowTime)
    function NowTime(){
      return function(input,params){
        return moment.unix(input).format('ll');
      }
    }
  TeamCheckController.$inject = ['$scope','$sce', '$filter', 'ngDialog', 'editableOptions', 'editableThemes', '$q', 'schoolResourceApi', 'adminResourceApi', 'APP_PARMAS'];

  function TeamCheckController($scope,$sce, $filter, ngDialog, editableOptions, editableThemes, $q, schoolResourceApi, adminResourceApi, APP_PARMAS) {
    var vm = this;
    $scope.passApply=function(id){
      ngDialog.openConfirm({
              template: 'passconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.PassTeamApply({application_id:id},function(data){
                getTeamList();
              })
            }, function (reason) {
      });
    }
    $scope.getExcel=function(id){
      adminResourceApi.GetTeamcheckExcel({application_id:id},function(data){
         $timeout(function(){vm.exportUrl=$sce.trustAsResourceUrl(data.data.file_url);},0,true)
      })
    }
    $scope.rejectApply=function(id){
      ngDialog.openConfirm({
              template: 'rejectconfirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.RejectTeamApply({application_id:id}).$promise.then(function(){
                getTeamList();
              })
            }, function (reason) {
      });
    }
    function getTeamList() {
      adminResourceApi.CreateTeamApplyQuery(function(data) {
        vm.teams = data.data;
      })
    }
    getTeamList();
    vm.showApplyDetail=function(id){
      ngDialog.open({
          template: 'ApplyDetail',
          data:{id:id},
          controller:DetailCtrl
      });
    } 
    DetailCtrl.$inject=['$scope'];  
    function DetailCtrl($scope){
      adminResourceApi.TeamApplyDetailQuery({application_id:$scope.ngDialogData.id}).$promise.then(function(data){
       $scope.detail=data.data;
      })
     }
  }
})();