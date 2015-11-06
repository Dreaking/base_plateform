/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
  'use strict';

  angular
    .module('app.routes')
    .config(routesConfig);

  routesConfig.$inject = ['$stateProvider', '$httpProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', 'USER_ROLES'];

  function routesConfig($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider, helper, USER_ROLES) {

    $httpProvider.interceptors.push([
      '$injector',
      function($injector) {
        return $injector.get('AuthInterceptor');
      }
    ]);
    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function(obj) {
      var query = '',
        name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null)
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];


    $locationProvider.html5Mode(false);

    // defaults to dashboard
    $urlRouterProvider.otherwise('/login');

    // 
    // Application Routes
    // -----------------------------------   
    $stateProvider
    // 
    // 单独的页面
    // ----------------------------------- 
      .state('page', {
        abstract: true,
        templateUrl: helper.basepath('common/page.html'),
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        resolve: helper.resolveFor('modernizr', 'icons'),
        controller: ['$rootScope', function($rootScope) {
          $rootScope.app.layout.isBoxed = false;
        }]
      })
      .state('page.login', {
        url: '/login',
        title: '账号登录',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/login.html'),
      })
      .state('page.register', {
        url: '/register',
        title: '账号注册',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/register.html'),
        resolve: helper.resolveFor('md5')
      })
      .state('page.recover', {
        url: '/recover',
        title: '账号注册',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/recover.html')
      })
      .state('page.changepassword', {
        url: '/changepassword',
        title: '修改密码',
        data: {
          authorizedRoles: [USER_ROLES.all]
        },
        templateUrl: helper.basepath('common/changepassword.html')
      })
      // --基地管理员--
      // ------------------------
      .state('admin', {
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        resolve: helper.resolveFor('ngDialog', 'spinkit', 'moment', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'whirl')
      })
      .state('admin.secondAdmin', {
        url: '/secondAdmin',
        title: '二级管理员',
        templateUrl: helper.basepath('custom/secondadmin.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.userManagement', {
        url: '/userManagement',
        title: '成员管理',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/usermanagement.html'),
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.teamList', {
        url: '/teamList',
        title: '团队列表',
        templateUrl: helper.basepath('custom/teamlist.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.teamCheck', {
        url: '/teamCheck',
        title: '团队审核',
        templateUrl: helper.basepath('custom/teamcheck.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ngDialog', 'xeditable', 'spinkit')
      })
      .state('admin.teamApplyCheck', {
        url: '/teamApplyCheck',
        title: '团队审核',
        templateUrl: helper.basepath('custom/teamapplycheck.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ngDialog', 'xeditable')
      })
      .state('admin.joinTeam', {
        url: '/joinTeam',
        title: '招聘管理',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/jointeam.html'),
        resolve: helper.resolveFor('ngDialog')
      })
      .state('admin.view', {
        url: '/recruit/{mid:[0-9]{1,4}}',
        title: '预览文章',
        templateUrl: helper.basepath('custom/adminpost-view.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.secondadmin]
        },
        resolve: helper.resolveFor('ngWig', 'moment')
      })
      .state('admin.postsview', {
        url: '/posts/{id:[0-9]{1,4}}',
        title: '预览帖子',
        templateUrl: helper.basepath('common/posts-view.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.secondadmin]
        },
        resolve: helper.resolveFor('ngWig', 'moment')
      })
      .state('admin.baseIntroduce', {
        url: '/baseintroduce',
        title: '基地介绍',
        templateUrl: helper.basepath('custom/baseintroduce.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ngDialog','ueditor', 'ngImgCrop', 'filestyle')
      })
      .state('admin.baseNotice', {
        url: '/baseNotice',
        title: '基地通知',
        templateUrl: helper.basepath('custom/basenotice.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.baseActivity', {
        url: '/baseActivity',
        title: '基地活动',
        templateUrl: helper.basepath('custom/baseactivities.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.base-post', {
        url: '/基地活动详情',
        title: '',
        templateUrl: helper.basepath('custom/basepost.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('angular-jqcloud')
      })
      .state('admin.baseactivity', {
        url: '/baseactivity/:id',
        templateUrl: helper.basepath('custom/baseactivity.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.baseGame', {
        url: '/game',
        title: '基地比赛',
        templateUrl: helper.basepath('custom/basegame.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ueditor','ngDialog')
      })
      .state('admin.modules', {
        url: '/modules',
        title: '基地模块',
        templateUrl: helper.basepath('custom/modules.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('admin.posts', {
        url: '/posts',
        title: '帖子管理',
        controller: 'BasePostController',
        controllerAs: 'pag',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/posts.html')
      })
      .state('admin.changepassword', {
        url: '/changepassword',
        title: 'changepassword',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/basechangepassword.html'),
      })
      .state('admin.teamorders', {
        url: '/teamorders/:id',
        title: '操作记录',
        controller: 'BaseTeamOrderController',
        controllerAs: 'table',
        templateUrl: helper.basepath('custom/team-orders.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('datatables')
      })
      .state('admin.nestable', {
        url: '/nestable',
        title: 'Nestable',
        templateUrl: helper.basepath('custom/nestable.html'),
        controller:'NestableController',
        controllerAs:'nest',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('ng-nestable','ngDialog')
      })
      .state('admin.teamrecord', {
        url: '/teamrecord',
        title: '团队流水',
        templateUrl: helper.basepath('custom/teamrecord.html'),
        controller: 'BaseTeamRecordController',
        controllerAs: 'table',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('datatables')
      })
      .state('admin.teamaccount', {
        url: '/teamaccount',
        title: '团队钱包',
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        templateUrl: helper.basepath('custom/teamaccount.html'),
        resolve: angular.extend(helper.resolveFor('ngDialog', 'xeditable'), {
          tpl: function() {
            return {
              path: helper.basepath('ngdialog-template.html')
            };
          }
        }),
        controller: 'TeamAccountController'
      })
      .state('admin.goods', {
        url: '/goods',
        title: '团队列表',
        templateUrl: helper.basepath('custom/basegoods.html'),
        data: {
          authorizedRoles: [USER_ROLES.baseadmin, USER_ROLES.admin]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('team', {
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        resolve: helper.resolveFor('ngDialog', 'spinkit', 'fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'whirl')
      })
      .state('team.teamworker', {
        url: '/teamworker',
        title: '成员管理',
        templateUrl: helper.basepath('custom/teamworker.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader]
        },
        resolve: helper.resolveFor('xeditable', 'ngDialog')
      })
      .state('team.suportlist', {
        url: '/suportlist',
        title: '团队审核',
        templateUrl: helper.basepath('custom/suportlist.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('xeditable', 'moment', 'spinkit')
      })
      .state('team.suportcenter', {
        url: '/suportcenter',
        title: '申请中心',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamroomapply.html'),
        resolve: helper.resolveFor('parsley', 'inputmask', 'ngDialog')
      })
      .state('team.team', {
        url: '/m/teamworker',
        title: '成员管理',
        templateUrl: helper.basepath('custom/m.teamworker.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('team.joinercheck', {
        url: '/joinercheck',
        title: '招聘成员',
        templateUrl: helper.basepath('custom/joinercheck.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('xeditable')
      })
      .state('team.teamintroduce', {
        url: '/teamintroduce',
        title: '基地介绍',
        templateUrl: helper.basepath('custom/teamintroduce.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('ueditor', 'ngImgCrop', 'filestyle', 'ngDialog')
      })
      .state('team.recruit', {
        url: '/recruit',
        title: '招聘管理',
        controller: 'TeamRecruitController',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teampost.html'),
        resolve: helper.resolveFor('moment', 'ngDialog')
      })
      .state('team.record', {
        url: '/record',
        title: '记账本',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamrecordlist.html'),
        controller: 'TeamRecordController',
        controllerAs: 'todo',
        resolve: helper.resolveFor('moment', 'ngDialog')
      })
      .state('team.compost', {
        url: '/compost',
        title: '发布新招聘',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teampost-compost.html'),
        resolve: helper.resolveFor('ueditor')
      })
      .state('team.view', {
        url: '/recruit/{mid:[0-9]{1,4}}',
        title: '预览文章',
        templateUrl: helper.basepath('custom/teampost-view.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('ngWig', 'moment')

      })
      .state('team.orders', {
        url: '/orders',
        title: '团队补贴',
        controller: 'TeamOrderController',
        controllerAs: 'table',
        templateUrl: helper.basepath('custom/teamorder.html'),
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        resolve: helper.resolveFor('datatables', 'moment')
      })
      .state('team.changepassword', {
        url: '/password',
        title: '修改密码',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamchangepassword.html'),
      })
      .state('team.userinfo', {
        url: '/info',
        title: '个人信息',
        data: {
          authorizedRoles: [USER_ROLES.teamleader, USER_ROLES.teamworker]
        },
        templateUrl: helper.basepath('custom/teamuserinfo.html'),
      })
      .state('visitor', {
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'whirl')
      })
      .state('visitor.info', {
        url: '/perfectinfo',
        title: '个人信息',
        templateUrl: helper.basepath('custom/visitorinfo.html'),
        data: {
          authorizedRoles: [USER_ROLES.visitor]
        }
      })
      .state('visitor.applyteam', {
        url: '/applyteam',
        title: '申请新团队',
        templateUrl: helper.basepath('custom/applyteam.html'),
        data: {
          authorizedRoles: [USER_ROLES.visitor]
        },
        resolve: helper.resolveFor('ueditor','angularFileUpload', 'ngDialog')
      })
      // 
      // CUSTOM RESOLVES
      //   Add your own resolves properties
      //   following this object extend
      //   method
      // ----------------------------------- 
      // .state('admin.someroute', {
      //   url: '/some_url',
      //   templateUrl: 'path_to_template.html',
      //   controller: 'someController',
      //   resolve: angular.extend(
      //     helper.resolveFor(), {
      //     // YOUR RESOLVES GO HERE
      //     }
      //   )
      // })
    ;

  } // routesConfig

})();