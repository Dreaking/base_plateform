(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http','USER_ROLES'];
    function SidebarLoader($http,USER_ROLES) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(type,onReady, onError) {
          var menuJson,menuURL;
          switch(type){
            case USER_ROLES.baseadmin:menuJson = 'server/custom/baseadmin-sidebar-menu.json';break;
            case USER_ROLES.admin:menuJson = 'server/custom/admin-sidebar-menu.json';break;
            case USER_ROLES.teamleader:menuJson = 'server/custom/teamleader-sidebar-menu.json';break;
            case USER_ROLES.teamworker:menuJson = 'server/custom/teamworker-sidebar-menu.json';break;
            case USER_ROLES.visitor:menuJson = 'server/custom/visitor-sidebar-menu.json';break;
            default:menuJson = '';break;
          }          
          
          menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get(menuURL)
            .success(onReady)
            .error(onError);
        }
    }
})();