(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('PostsViewController', PostsViewController)
    .filter('fromNow', fromNow)

  function fromNow(){
    return function(input,params){
      return moment.unix(input).fromNow();
    }
  }
  PostsViewController.$inject = ['$scope', '$timeout', '$state', 'schoolResourceApi', 'ngDialog']

  function PostsViewController($scope, $timeout, $state, schoolResourceApi, ngDialog) {
    var vm = $scope;
    vm.comments=[];
    vm.submitted = false;
    vm.notMore=false;
    vm.validateInput = function(name, type) {
      var input = vm.replyFrom[name];
      return (input.$dirty || vm.submitted) && input.$error[type];
    };
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
    vm.replyTo=function(){
      vm.submitted = true;
      if (vm.replyFrom.$valid) {
        schoolResourceApi.PostRepplyQuery({post_id:vm.post_id,content:vm.reply}).$promise.then(function(data){
          vm.openTimed('<h3 class="text-center text-success">回复成功</h3>');
        })
      }
      else{
          vm.openTimed('<h3 class="text-center">请填写回复内容</h3>');
      }
      console.log(vm.reply)
    }
    function getDetail(id) {
      vm.post_id=id;
      schoolResourceApi.GetPostDetail({
        post_id: id
      }, function(data) {
        vm.recruit = data.data;
      })
    }
    vm.getMoreComment=function(id){
      schoolResourceApi.RepplyQuery({post_id:vm.post_id,is_refresh:0,reply_count:5,last_reply_id:id},function(data){
        if(data.data.length<5)
          vm.notMore=true;
        $timeout(function(){vm.comments=vm.comments.concat(data.data)},0,true);
      })
    }
    vm.getCommentList=function(id){
      schoolResourceApi.RepplyQuery({post_id:id,is_refresh:1,reply_count:5},function(data){
        if(data.data.length<5)
          vm.notMore=true;
        $timeout(function(){vm.comments=vm.comments.concat(data.data)},0,true);
      })
    }
    vm.$on('$stateChangeSuccess', function(event, toState, toParams) {
      getDetail(toParams.id);
      vm.getCommentList(toParams.id)
    });
  }
})();