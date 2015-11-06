/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('usermanagementController', userManagementCtrlFn);

    userManagementCtrlFn.$inject = ['$scope','$timeout','$filter', '$http', 'editableOptions', 'editableThemes','$q','schoolResourceApi','teamResourceApi','adminResourceApi','APP_PARMAS'];
    function userManagementCtrlFn($scope,$timeout,$filter, $http, editableOptions, editableThemes, $q,schoolResourceApi,teamResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        activate();
        function activate() {

          schoolResourceApi.TeamQuery(function(data){
            vm.teams=data.data;
            $scope.selectTeam=data.data[0].team_id;
            vm.loadUserList();
          })
          vm.types=[
            {id:0,name:'主要负责人'},
            {id:1,name:'次要负责人'},
            {id:2,name:'普通成员'}           
          ]
          $scope.selectType=vm.types[0].id;
          vm.loadUserList=function(){
            adminResourceApi.TeamMemberListQuery({type:$scope.selectType,team_id:$scope.selectTeam},function(data){
              vm.users=data.data;
              console.log(data)
            })
          }

          vm.loadColleges = function(id) {
            return vm.colleges? null : schoolResourceApi.CollegeQuery(function(data){
                   vm.colleges=data.data;
                   vm.loadMajors(data.data[0].school_id);
            })
          };
          vm.loadMajors=function(id){
            return id? schoolResourceApi.MajorQuery({school_id:id},function(data){
                   vm.majors=data.data;
            }):null;
          }
          vm.showColleges = function(user) {
            if(user.school_name &&vm.colleges&& vm.colleges.length) {
              var selected = $filter('filter')(vm.colleges, {school_name: user.school_name});
              console.log(selected[0].school_name)
              return selected.length ? selected[0].school_name : '暂无';
            } else {
              return user.school_name || '暂无';
            }
          };
          vm.showRole = function(user) {
            if(user.type && vm.types.length) {
              var selected = $filter('filter')(vm.types, {id: user.type});
              return selected.length ? selected[0].name : '暂无';
            } else {
              return APP_PARMAS.TEAMROLENAME[user.type] || '暂无';
            }
          };
          vm.showMajors = function(user) {
            if(user.major_name && vm.majors&&vm.majors.length) {
              var selected = $filter('filter')(vm.majors, {major_name: user.major_name});
              return selected.length ? selected[0].major_name : '暂无';
            } else {
              return user.major_name || '暂无';
            }
          };

          vm.checkName = function(data) {
            if (!data||data=='') {
              return '姓名不能为空';
            }
          };
          vm.checkPhone=function(data){
            var re= /^(13[0-9]{9})|(15[0-9]{9})$/;
            if (!data||data.length!==11||!re.test(data)) {
              return '请输入正确的手机号码';
            }
          }
          vm.checkID=function(data){
            if (!data) {
              return '请选择';
            }
          }

          // remove user
          vm.removeUser = function(index) {
            vm.users.splice(index, 1);
          };

          // add user
          vm.addUser = function() {
            vm.inserted = {
              name: '',
              school_name: '',
              major_name:'',
              team_name:'',
              type:'',
              password:APP_PARMAS.DefaultPassword
            };
            vm.users.push(vm.inserted);
          };


          // editable table
          // ----------------------------------- 

          // filter users to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.users, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          // cancel all changes
          vm.cancel = function(rowform) {
            rowform.$cancel();
          };

          // save edits
          vm.saveTable = function() {
            var results = [];
            for (var i = vm.users.length; i--;) {
              var user = vm.users[i];
              // actually delete user
              if (user.isDeleted) {
                vm.users.splice(i, 1);
              }
              // mark as not new 
              if (user.isNew) {
                user.isNew = false;
              }

              // send on server
              // results.push($http.post('/saveUser', user));
              console.log('Saving Table...');
            }

            return $q.all(results);
          };

        }
    }
})();
