!(function(angular) {
  "use strict";

  angular.module('app.controllers').directive("ueditor", ueditorFn);
  ueditorFn.$inject = ['$timeout']

  function ueditorFn($timeout) {
    return {
      restrict: 'AE',
      transclude: true,
      replace: true,
      priority: 0,
      template: '<script name="content" type="text/plain" ng-transclude></script>',
      require: '?ngModel',
      scope: {
        config: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var editor = new UE.ui.Editor(scope.config || {});
        editor.render(element[0]);
        editor.addListener('ready', function() {
          editor.setContent(ngModel.$viewValue);
        })
        scope.$on('$stateChangeStart', function() {
          console.log(123)
          editor.destroy()
        })
        if (ngModel) {
          //Model数据更新时，更新百度UEditor
          ngModel.$render = function() {
            try {
              editor.setContent(ngModel.$viewValue);
            } catch (e) {

            }
          };
          editor.addListener('contentChange', function() {
            $timeout(function() {
              ngModel.$setViewValue(editor.getContent());
            }, 0, true)
          })
        }
      }
    }
  };
})(angular);