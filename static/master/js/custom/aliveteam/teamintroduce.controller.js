(function() {
  'use strict';

  angular
    .module('app.controllers')
    .controller('TeamIntroduceCtroller', TeamIntroduceCtroller)

  TeamIntroduceCtroller.$inject = ['$scope', '$timeout', 'ngDialog', 'schoolResourceApi', 'APP_PARMAS', 'teamResourceApi']

  function TeamIntroduceCtroller($scope, $timeout, ngDialog, schoolResourceApi, PP_PARMAS, teamResourceApi) {
    var vm = this;
    $scope.content = '';
    vm.editorConfig = {
      initialFrameHeight: 300
    }
    vm.reset = function() {
      vm.myImage = '';
      vm.myCroppedImage = '';
      vm.myImage = '';
      vm.imgcropType = 'square';
      schoolResourceApi.TeamDetailGet(function(data) {
        $timeout(function() {
          $scope.content = data ? data.data.description : '';
          vm.myCroppedImage = data ? 'data:image/png;base64,' + data.data.logo_base64 : '';
        }, 0, true)
      })
    };

    function DataWrap(str) {
      console.log(str)
      return 'data:image/png;base64,' + str;
    }
    vm.reset();

    var handleFileSelect = function(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function(evt) {
        $scope.$apply(function( /*$scope*/ ) {
          vm.myImage = evt.target.result;
        });
      };
      if (file)
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
    vm.saveIntroduce = function() {
      var transition = vm.myCroppedImage.slice(22);
      var dialog = ngDialog.open({
        template: '<div class="panel-body loader-demo"><div class="sk-spinner sk-spinner-double-bounce"><div class="sk-double-bounce1"></div><div class="sk-double-bounce2"></div></div></div>',
        plain: true,
        closeByDocument: false,
        closeByEscape: false
      });
      teamResourceApi.UpdateIntroduce({
        team_logo: transition,
        description: $scope.content,
        project_description: ' '
      }, function(data) {
        dialog.close();
      })
    }
  }
})();