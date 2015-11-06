(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('UserInfoController', UserInfoController);
  UserInfoController.$inject=['schoolResourceApi']
  function UserInfoController(schoolResourceApi) {
    var vm = this;
    vm.submitted = false;
    vm.validateInput = function(name, type) {
      var input = vm.formValidate[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
    vm.getUserInfo=function(){
      schoolResourceApi.GetUserInfo(function(data){
        vm.user=data.data;
      })
      vm.loadColleges();
    }
    vm.loadColleges = function() {
            return vm.colleges? null : schoolResourceApi.CollegeQuery(function(data){
                   vm.colleges=data.data;
                   vm.loadMajors(data.data[0].school_id);
            })
    };
    vm.loadMajors=function(id){
            return id? schoolResourceApi.MajorQuery({school_id:id},function(data){
                   vm.majors=data.data;
            }):null;
    };
    vm.getUserInfo();
    vm.submitForm = function() {
      vm.submitted = true;
      if (vm.formValidate.$valid) {
        vm.user['is_male']=1;
        for(var i in vm.user){
          if(!vm.user[i])
            delete vm.user[i];
        }
        schoolResourceApi.SetUserInfo(vm.user,function(data){
          console.log(data)
        })
      } else {
        console.log('Not valid!!');
        return false;
      }
    };
  }
})();