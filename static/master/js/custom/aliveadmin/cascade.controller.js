(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('CascadeController', CascadeController);
  CascadeController.$inject = ['$timeout', 'schoolResourceApi', 'adminResourceApi', 'ngDialog']

  function CascadeController($timeout, schoolResourceApi, adminResourceApi, ngDialog) {
    var vm = this;
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
    vm.getList = function() {
      var i, j;
      vm.income = [];
      vm.payout = [];
      vm.incomePayment = {};
      vm.incomePaymentBrige = {};
      vm.incomeFlow = {};
      vm.incomeFlowBrige = {};
      vm.incomeCommon = {};
      vm.incomeCommonBrige = {};
      vm.payoutPayment = {};
      vm.payoutPaymentBrige = {};
      vm.payoutFlow = {};
      vm.payoutFlowBrige = {};
      vm.payoutCommon = {};
      vm.payoutCommonBrige = {};
      schoolResourceApi.LayoutAllQuery(function(data) {
        data = data.data;
        for (i in data) {
          data[i].type == 0 ? vm.income.push(data[i]) : vm.payout.push(data[i]);
        }
        console.log(vm.income)
        $timeout(function(){
        for (i=vm.income.length-1;i>0;i--) {
          vm.incomeCommonBrige[vm.income[i].name]=vm.income[i].layout_one_id;
          vm.incomePaymentBrige[vm.income[i].name]=vm.income[i].layout_one_id;
          vm.incomeFlowBrige[vm.income[i].name]=vm.income[i].layout_one_id;
          for (j in vm.income[i].sub_list) {
            if (vm.income[i].sub_list[j].type == 0) {
              vm.incomeCommon[vm.income[i].name] = !vm.incomeCommon[vm.income[i].name] ? new Array() : vm.incomeCommon[vm.income[i].name];
              vm.incomeCommon[vm.income[i].name].push(vm.income[i].sub_list[j])
            } else if (vm.income[i].sub_list[j].type == 1) {
              vm.incomePayment[vm.income[i].name] = !vm.incomePayment[vm.income[i].name] ? new Array() : vm.incomePayment[vm.income[i].name];
              vm.incomePayment[vm.income[i].name].push(vm.income[i].sub_list[j])
            } else {
              vm.incomeFlow[vm.income[i].name] = !vm.incomeFlow[vm.income[i].name] ? new Array() : vm.incomeFlow[vm.income[i].name];
              vm.incomeFlow[vm.income[i].name].push(vm.income[i].sub_list[j])
            }
          }
        }
        for (i in vm.payout) {
          vm.payoutCommonBrige[vm.payout[i].name]=vm.payout[i].layout_one_id;
          vm.payoutPaymentBrige[vm.payout[i].name]=vm.payout[i].layout_one_id;
          vm.payoutFlowBrige[vm.payout[i].name]=vm.payout[i].layout_one_id;
          for (j in vm.payout[i].sub_list) {
            if (vm.payout[i].sub_list[j].type == 0) {
              vm.payoutCommon[vm.payout[i].name] = !vm.payoutCommon[vm.payout[i].name] ? new Array() : vm.payoutCommon[vm.payout[i].name];
              vm.payoutCommon[vm.payout[i].name].push(vm.payout[i].sub_list[j])
            } else if (vm.payout[i].sub_list[j].type == 1) {
              vm.payoutPayment[vm.payout[i].name] = !vm.payoutPayment[vm.payout[i].name] ? new Array() : vm.payoutPayment[vm.payout[i].name];
              vm.payoutPayment[vm.payout[i].name].push(vm.payout[i].sub_list[j])
            } else {
              vm.payoutFlow[vm.payout[i].name] = !vm.payoutFlow[vm.payout[i].name] ? new Array() : vm.payoutFlow[vm.payout[i].name];
              vm.payoutFlow[vm.payout[i].name].push(vm.payout[i].sub_list[j])
            }
          }
        }  
        vm.incomeCommonOneSelected = {name:Object.keys(vm.incomeCommon)[0]?Object.keys(vm.incomeCommon)[0]:Object.keys(vm.incomeCommonBrige)[0]}
        vm.incomeCommonOneSelected['id']=vm.incomeCommonBrige[vm.incomeCommonOneSelected.name];
        vm.incomeCommonTwoSelected = angular.copy(vm.incomeCommon[Object.keys(vm.incomeCommon)[0]]);
        vm.incomeCommonTwoSelected = vm.incomeCommonTwoSelected ? vm.incomeCommonTwoSelected[0] : {name:''};

        vm.incomePaymentOneSelected = {name:Object.keys(vm.incomePaymentBrige)[0]?Object.keys(vm.incomePaymentBrige)[0]:Object.keys(vm.incomePaymentBrige)[0]}
        vm.incomePaymentOneSelected['id']=vm.incomePaymentBrige[vm.incomePaymentOneSelected.name]
        vm.incomePaymentTwoSelected = angular.copy(vm.incomePayment[Object.keys(vm.incomePayment)[0]]);
        vm.incomePaymentTwoSelected = vm.incomePaymentTwoSelected ? vm.incomePaymentTwoSelected[0] : {name:''};

        vm.incomeFlowOneSelected = {name:Object.keys(vm.incomeFlow)[0]?Object.keys(vm.incomeFlow)[0]:Object.keys(vm.incomeFlowBrige)[0]}
        vm.incomeFlowOneSelected['id']=vm.incomeFlowBrige[vm.incomeFlowOneSelected.name]
        vm.incomeFlowTwoSelected = angular.copy(vm.incomeFlow[Object.keys(vm.incomeFlow)[0]]);
        vm.incomeFlowTwoSelected = vm.incomeFlowTwoSelected ? vm.incomeFlowTwoSelected[0] : {name:''};

        vm.payoutCommonOneSelected = {name:Object.keys(vm.payoutCommon)[0]?Object.keys(vm.payoutCommon)[0]:Object.keys(vm.payoutCommonBrige)[0]}
        vm.payoutCommonOneSelected['id']=vm.payoutCommonBrige[vm.payoutCommonOneSelected.name]
        vm.payoutCommonTwoSelected = angular.copy(vm.payoutCommon[Object.keys(vm.payoutCommon)[0]]);
        vm.payoutCommonTwoSelected = vm.payoutCommonTwoSelected ? vm.payoutCommonTwoSelected[0] : {name:''};

        vm.payoutPaymentOneSelected = {name:Object.keys(vm.payoutPayment)[0]?Object.keys(vm.payoutPayment)[0]:Object.keys(vm.payoutPaymentBrige)[0]}
        vm.payoutPaymentOneSelected['id']=vm.payoutPaymentBrige[vm.payoutPaymentOneSelected.name]
        vm.payoutPaymentTwoSelected = angular.copy(vm.payoutPayment[Object.keys(vm.payoutPayment)[0]]);
        vm.payoutPaymentTwoSelected = vm.payoutPaymentTwoSelected ? vm.payoutPaymentTwoSelected[0] : {name:''};

        vm.payoutFlowOneSelected = {name:Object.keys(vm.payoutFlow)[0]?Object.keys(vm.payoutFlow)[0]:Object.keys(vm.payoutFlowBrige)[0]}
        vm.payoutFlowOneSelected['id']=vm.payoutFlowBrige[vm.payoutFlowOneSelected.name]
        vm.payoutFlowTwoSelected = angular.copy(vm.payoutFlow[Object.keys(vm.payoutFlow)[0]]);
        vm.payoutFlowTwoSelected = vm.payoutFlowTwoSelected ? vm.payoutFlowTwoSelected[0] : {name:''};
        console.log(vm.incomeCommonBrige,vm.incomeCommon)
       },0,true)
        
      })
    }
    function reload(){
      vm.getList();
      vm.openTimed('<h4 class="text-center text-success">操作成功</h4>')
    }
    function reloadPlace(){
      vm.getPlaceList();
      vm.openTimed('<h4 class="text-center text-success">操作成功</h4>')
    }
    function needSelectDialog(){
      vm.openTimed('<h4 class="text-center text-info">请选择要修改的级联</h4>')
    }
    function isInListDialog(){
      vm.openTimed('<h4 class="text-center text-info">已存在相同的级联</h4>')
    }
    function isOutListDialog(){
      vm.openTimed('<h4 class="text-center text-info">不存在要操作级联</h4>')
    }
    function isInList(name,list){
      if(!list)
        return false;
      for(var i in Object.keys(list)){
        if(name==Object.keys(list)[i])
          return true;
      }
      for(var i in list){
        if(name==list[i].name)
          return true;
      }
      return false;
    }
    function hasID(layout){
      if(!!layout.id)
        return true;
      else if(!!layout.layout_two_id)
        return true;
      return false;
    }
    vm.layoutOneEdit=function(layout,list){
      if(!hasID(layout)){
        needSelectDialog()
        return;
      }
      else if(isInList(layout.name,list)){
        isInListDialog();
        return;
      }
      else 
      adminResourceApi.LayoutOneEdit({layout_one_id:layout.id,name:layout.name},function(data){
        reload()
      })
    }
    vm.layoutOneDelect=function(layout,list){
      if(isInList(layout.name,list))
      adminResourceApi.LayoutOneDelect({layout_one_id:layout.id},function(data){
        reload()
      })
    }
    vm.layoutOneAdd=function(layout,list,type){
      if(isInList(layout.name,list)){
        isInListDialog();
        return;
      }
      else 
      adminResourceApi.LayoutOneAdd({name:layout.name,type:type},function(data){
        reload()
      })
    }
    vm.layoutTwoEdit=function(layout,list){
      if(!hasID(layout)){
        needSelectDialog()
        return;
      }
      else if(isInList(layout.name,list)){
        isInListDialog();
        return;
      }
      else 
      adminResourceApi.LayoutTwoEdit({layout_one_id:layout.layout_two_id,name:layout.name},function(data){
        reload()
      })
    }
    vm.layoutTwoDelect=function(layout,list){
      if(isInList(layout.name,list))
      adminResourceApi.LayoutTwoDelect({layout_two_id:layout.layout_two_id},function(data){
        reload()
      })
    }
    vm.layoutTwoAdd=function(parent,layout,list,type){
      if(isInList(layout.name,list)){
        isInListDialog();
        return;
      }
      else 
      adminResourceApi.LayoutTwoAdd({parent_id:parent.id,name:layout.name,type:type},function(data){
        reload()
      })
    }
    vm.changeSelected = function(from, to) {
      $timeout(function() {
        from.name = to;
      }, 0, true)
    }
    vm.changeOneSelected = function(lists, one, two, key,value) {
      console.log(lists, one, two, key)
      $timeout(function() {
        one.name = key;
        one.id=value;
        if(lists[key]){
         two.id = lists[key][0].layout_two_id;
         two.name = lists[key][0].name;
        }
        else{
          two.name='';
          delete(two.layout_two_id);
        }
      }, 0, true)
    }
    vm.getPlaceList=function(){
      schoolResourceApi.PlaceQuery().$promise.then(function(data){
        vm.placeList=data.data;
        vm.placeSelected=angular.copy(vm.placeList?vm.placeList[0]:{name:''})
      })
    }
    function hasPlace(place,placeList){
      for(var i in placeList)
        if (place.name==placeList[i].name)
          return true;
      return false;
    }
    vm.addPlace=function(place){
      console.log(place)
      if(hasPlace(place,vm.placeList))
        isInListDialog();
      else
      adminResourceApi.PlaceAdd({place_name:place.name}).$promise.then(function(data){
        reloadPlace()
      })
    }
    vm.editPlace=function(place){
      if(hasPlace(place,vm.placeList))
        isInListDialog();
      else if(!place.id)
        needSelectDialog();
      else
      adminResourceApi.PlaceEdit({place_name:place.name,place_id:place.id}).$promise.then(function(data){
        reloadPlace()
      })
    }
    vm.deletePlace=function(place){
      if(!hasPlace(place,vm.placeList))
        isOutListDialog();
      else if(!place.id)
        needSelectDialog();
      else
      adminResourceApi.PlaceDelete({place_name:place.name,place_id:place.id}).$promise.then(function(data){
        reloadPlace()
      })
    }
    vm.changePlaceSelected=function(place){
      $timeout(function(){
        vm.placeSelected.id=place.id;
        vm.placeSelected.name=place.name;
      },0,true)
    }
    vm.getList();
    vm.getPlaceList();
    vm.PaymentEdit = function(data) {
      adminResourceApi.PaymentEdit({
        payment_type_list: data
      }, function(data) {
        vm.openTimed('<h3 class="text-center text-success">保存成功</h3>')
      })
    }
  }
})();