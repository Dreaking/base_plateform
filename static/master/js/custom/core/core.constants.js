/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.core')
    .constant('APP_MEDIAQUERY', {
      'desktopLG': 1200,
      'desktop': 992,
      'tablet': 768,
      'mobile': 480,
    })
    .constant('APP_PARMAS', {
      'DefaultPassword':'000000',
      'NOTICEITEM':1000,
      'ROLENAME':['基地管理员','二级管理员','主要负责人','次级负责人','','普通游客'],
      'TEAMROLENAME':['主要负责人','次级负责人','普通成员'],
      'TEAMSTATE':['软性入驻','硬性入驻'],
      'USERBLOCKNAME':'波纹科技',
      'USERBLOCKPICTURE':'app/img/user/01.jpg'
    })
    .constant('AUTH_EVENTS', {
      //--登录成功--
      loginSuccess: 'auth-login-success',
      //--登录失败--
      loginFailed: 'auth-login-failed',
      //--退出成功--
      logoutSuccess: 'auth-logout-success',
      //--认证超时--
      sessionTimeout: 'auth-session-timeout',
      //--未认证权限--
      notAuthenticated: 'auth-not-authenticated',
      //--未授权--
      notAuthorized: 'auth-not-authorized',
      //--服务器出错--
      systemError: 'something-wrong-system'
    })
    .constant('USER_ROLES', {
      visitor: '5',
      teamworker: '3',
      teamleader: '2',
      admin: '1',
      baseadmin: '0'
    })
})();