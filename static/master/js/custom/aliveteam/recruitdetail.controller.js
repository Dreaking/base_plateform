(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('RecruitViewController', RecruitViewController)
    .filter('NowTime', NowTime)

  function NowTime() {
    return function(input, params) {
      return moment.unix(input).format('ll');
    }
  }
  RecruitViewController.$inject = ['$scope', '$timeout', '$state', 'schoolResourceApi', 'ngDialog']

  function RecruitViewController($scope, $timeout, $state, schoolResourceApi, ngDialog) {
    var vm = $scope;

    function getDetail(id) {
      schoolResourceApi.GetRecruitDetail({
        recruit_id: id
      }, function(data) {
        vm.recruit = data.data;
      })
    }
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams) {
      getDetail(toParams.mid);
    });
  }
})();