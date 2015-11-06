/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/
(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamPostController', TeamPostController)
    .filter('fromNow', fromNow)
    .filter('removeTag', removeTag);

  function fromNow() {
    return function(input, params) {
      return moment.unix(input).fromNow();
    }
  }

  function removeTag() {
    return function(input, params) {
      input = input.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
      input = input.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
      input = input.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
      input = input.replace(/ /ig, '');
      return input;
    }
  }
  TeamPostController.$inject = ['$timeout', '$state', '$q', 'teamResourceApi', 'paginationConfig', 'ngDialog']

  function TeamPostController($timeout, $state, $q, teamResourceApi, paginationConfig, ngDialog) {
    var vm = this;
    vm.maxSize = 1; //最大页码数
    vm.bigCurrentPage = 1;
    vm.selectAll = false;
    vm.delectAllPosts = function() {
      $timeout(function() {}, 0, true);
      console.log(vm.posts)
    }
    vm.gotoDetail = function(id) {
      $state.go('team.view', {
        mid: id
      });
    }
    vm.delectAllPosts = function() {
      var ids = [],
        promiseList = [];
      for (var i in vm.posts) {
        if (vm.posts[i].selected)
          ids.push(vm.posts[i].recruit_id)
      };
      if (ids.length > 0) {
        ngDialog.openConfirm({
          template: 'allconfirm',
          className: 'ngdialog-theme-default'
        }).then(function(value) {
          for (var i = 0, len = ids.length; i < len; i++)
            promiseList.push(teamResourceApi.DelectRecruit({
              recruit_id: ids[i]
            }).$promise);
          $q.all(promiseList).then(function(){
            vm.openTimed('<h3 class="text-center text-success">删除成功</h3>');
            vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage);
          })
        }, function(reason) {});
      } else
        vm.openTimed('<h3 class="text-center">请选择要删除的文章</h3>');
    }
    vm.checkAll = function(event) {
      event.stopPropagation();
      vm.selectAll = !vm.selectAll;
      $timeout(function() {
        for (var i in vm.posts) {
          vm.posts[i]['selected'] = vm.selectAll;
        };
      }, 0, true)
    }
    vm.delectPost = function(id) {
      ngDialog.openConfirm({
        template: 'confirm',
        className: 'ngdialog-theme-default'
      }).then(function(value) {
        teamResourceApi.DelectRecruit({
          recruit_id: id
        }, function(data) {
          vm.openTimed('<h3 class="text-center text-success">删除成功</h3>');
          vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage);
        })
      }, function(reason) {});
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
    vm.getPostList = function(num, size) {
      teamResourceApi.RecruitQuery({
        page_num: num,
        page_size: size
      }, function(data) {
        for (var i in data.data.recruit_list) {
          data.data.recruit_list[i]['selected'] = false;
        };
        $timeout(function() {
          vm.posts = data.data.recruit_list;
          vm.bigTotalItems = data.data.recruit_count;
        }, 0, true)
      })
    }
    vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)

    function activate() {
      vm.pageChanged = function() {
        console.log('Page changed to: ' + vm.bigCurrentPage);
        vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)
      };

      vm.maxSize = 5;
    }
    activate();
  }
})();