/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('secondadminController', secondadminCtrlFn);

    secondadminCtrlFn.$inject = ['$filter', '$http','ngDialog', 'editableOptions', 'editableThemes','$q','schoolResourceApi','adminResourceApi','APP_PARMAS'];
    function secondadminCtrlFn($filter, $http,ngDialog, editableOptions, editableThemes, $q,schoolResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        activate();
        function getAdminList(){
          adminResourceApi.AdminList(function(data){
            vm.users=data.data;
          })
        }
        function activate() {
          
          getAdminList();
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
            if(user.school_id && vm.colleges.length) {
              var selected = $filter('filter')(vm.colleges, {id: user.school_name});
              return selected.length ? selected[0].text : '暂无';
            } else {
              return user.school_name || '暂无';
            }
          };
          vm.showMajors = function(user) {
            if(user.major_id && vm.Majors.length) {
              var selected = $filter('filter')(vm.Majors, {id: user.major_name});
              return selected.length ? selected[0].text : '暂无';
            } else {
              return user.major_name || '暂无';
            }
          };

          vm.checkLoginname = function(data,name) {
            if (!data||data.length<6) {
              return '登录账号必须超过六位';
            }
            for(var i=0,len=vm.users.length-1;i<len;i++){
              if(data==vm.users[0].login_name)
                return '该用户名已存在';
            }
          };
          vm.checkName = function(data) {
            if (!data||data=='') {
              return '姓名不能为空';
            }
          };
          vm.checkPhone=function(data){
            var re= /^(13[0-9]{9})|(15[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})$/;
            if (!data||data.length!==11||!re.test(data)) {
              return '请输入正确的手机号码';
            }
          }
          vm.checkID=function(data){
            if (!data) {
              return '请选择';
            }
          }
          vm.saveUser = function(user) {
            console.log(user)
            return adminResourceApi.AddAdmin({
              login_name:user.login_name,
              name:user.name,
              school_id:user.school_name,
              major_id:user.major_name,
              phone:user.phone,
              password:APP_PARMAS.DefaultPassword
            },function(data){
               getAdminList();
            })
          };


          // remove user
          vm.removeUser = function(index,id) {
            ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.RemoveAdmin({user_id:id});
              vm.users.splice(index, 1);
            }, function (reason) {
            });
          };

          // add user
          vm.addUser = function() {
            vm.inserted = {
              login_name: '',
              name: '',
              school_name: '',
              major_name:'',
              phone:'',
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
            console.log('cancel')
            rowform.$cancel();
            vm.users.pop();
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
