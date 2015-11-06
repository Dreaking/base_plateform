(function() {
    'use strict';

    angular
        .module('app.controllers')
        .controller('GoodListController', GoodListController);

    GoodListController.$inject = ['$scope','$filter', '$http','ngDialog', 'editableOptions', 'editableThemes','$q','schoolResourceApi','adminResourceApi','APP_PARMAS'];
    function GoodListController($scope,$filter, $http,ngDialog, editableOptions, editableThemes, $q,schoolResourceApi,adminResourceApi,APP_PARMAS) {
        var vm = this;
        vm.goods=[];
        getGoodList();
        function getGoodList(){
          schoolResourceApi.GoodsQuery(function(data){
            vm.goods=data.data;
            console.log(vm.goods)
          })
        }
        vm.checkName = function(data) {
            if (!data||data=='') {
              return '商品名不能为空';
            }
        };
        vm.checkPrice=function(data){
            var re= /^[0-9]+$/;
            if (!re.test(data)) {
              return '请输入正确价格';
            }
        }
        vm.saveGood = function(good,id) {
          console.log(good,id)
          if(!!id){
            return adminResourceApi.EditGoods({goods_price:good.goods_price,goods_name:good.goods_name,goods_id:id},function(data){
               getGoodList();
            })
          }
          else
            return adminResourceApi.AddGoods(good,function(data){
               getGoodList();
            })
        };
        vm.removeGood = function(index,good) {
            $scope.deletedGood=good.good_name;
            ngDialog.openConfirm({
              template: 'confirm',
              className: 'ngdialog-theme-default'
            }).then(function (value) {
              adminResourceApi.DelectGoods({goods_id:index});
              vm.goods.splice(index, 1);
            }, function (reason) {
            });
          };

          // add good
          vm.addGood = function() {
            vm.inserted = {
              goods_name: '',
              goods_price: ''
            };
            vm.goods.push(vm.inserted);
          };


          // editable table
          // ----------------------------------- 

          // filter goods to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.goods, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          vm.cancel = function(rowform,id) {
            rowform.$cancel();
            if(!!!id)
            vm.goods.pop();
          };

        }
})();
