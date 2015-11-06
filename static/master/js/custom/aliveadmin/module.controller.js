(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('ModulesListController', ModulesListController);

    ModulesListController.$inject = ['$scope','$filter', '$http','ngDialog', 'editableOptions', 'editableThemes','$q','schoolResourceApi','adminResourceApi','APP_PARMAS'];
    function ModulesListController($scope,$filter, $http,ngDialog, editableOptions, editableThemes, $q,schoolResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        vm.sections=[];
        getModulesList();
        function getModulesList(){
          adminResourceApi.ModuleQuery(function(data){
            vm.sections=data.data;
            console.log(vm.sections)
          })
        }
        vm.checkName = function(data) {
            if (!data||data=='') {
              return '模块名不能为空';
            }
        };
        vm.saveModule = function(section,id) {
          console.log(section,id)
          if(!!id){
            return schoolResourceApi.ModuleEdit({section_id:id,name:section.name},function(data){
               getModulesList();
            })
          }
          else
            return schoolResourceApi.ModuleAdd(section,function(data){
               getModulesList();
            })
        };
        vm.removeModule= function(index,section) {
            ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default',
              data:{name:section.section_name},
              controller:['$scope',function(scope){
                scope.deletedModule=scope.ngDialogData.name;
              }]
            }).then(function (value) {
              schoolResourceApi.ModuleDelect({sections_id:index});
               getModulesList();
            }, function (reason) {
            });
          };

          // add section
          vm.addModule = function() {
            vm.inserted = {
              name: ''
            };
            vm.sections.push(vm.inserted);
          };


          // editable table
          // ----------------------------------- 

          // filter sections to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.sections, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          vm.cancel = function(rowform,id) {
            rowform.$cancel();
            if(!!!id)
            vm.sections.pop();
          };

        }
})();
