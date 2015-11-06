(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('BasePostController', BasePostController)
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
  BasePostController.$inject = ['$timeout', '$state', 'schoolResourceApi', 'adminResourceApi', 'paginationConfig', 'ngDialog']

  function BasePostController($timeout, $state, schoolResourceApi, adminResourceApi, paginationConfig, ngDialog) {
    var vm = this;
    vm.maxSize = 1; //最大页码数
    vm.bigCurrentPage = 1;
    vm.delectAllPosts = function() {
      $timeout(function() {}, 0, true);
      console.log(vm.posts)
    }
    getSectionList();

    function getSectionList() {
      adminResourceApi.ModuleQuery(function(data) {
        vm.sections = data.data;
        vm.section_id = data.data[0].section_id;
        vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)
      })
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
            promiseList.push(schoolResourceApi.PostDelete({
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
        schoolResourceApi.PostDelete({
          recruit_id: id
        }, function(data) {
          console.log(data);
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
      adminResourceApi.PostListQuery({
        section_id: vm.section_id,
        page_num: num,
        page_size: size
      }, function(data) {
        vm.posts = data.data.post_list;
        $timeout(function() {
          vm.bigTotalItems = data.data.recruit_count;
        }, 0, true)
      })
    }
    vm.pageChanged = function() {
      vm.getPostList(vm.bigCurrentPage, paginationConfig.itemsPerPage)
    };
    vm.maxSize = 5;
  }
})();