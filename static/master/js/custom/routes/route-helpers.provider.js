/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
  'use strict';

  angular
    .module('app.routes')
    .provider('RouteHelpers', RouteHelpersProvider)
    .factory('AuthInterceptor', AuthInterceptorFn)
  AuthInterceptorFn.$inject = ['$rootScope', '$q', 'AUTH_EVENTS'];
  RouteHelpersProvider.$inject = ['APP_REQUIRES'];

  //错误码拦截
  function AuthInterceptorFn($rootScope, $q, AUTH_EVENTS) {
    return {
      response: function(response) {
        $rootScope.$broadcast({         
          401: AUTH_EVENTS.notAuthenticated,
          410: AUTH_EVENTS.notAuthorized,
          411: AUTH_EVENTS.notAuthenticated,
          700: AUTH_EVENTS.systemError
        }[response.data.status], response);
        return response;
      }
    };
  }

  function RouteHelpersProvider(APP_REQUIRES) {

    /* jshint validthis:true */
    return {
      // provider access level
      basepath: basepath,
      resolveFor: resolveFor,
      // controller access level
      $get: function() {
        return {
          basepath: basepath,
          resolveFor: resolveFor
        };
      }
    };

    // Set here the base of the relative path
    // for all app views
    function basepath(uri) {
      return 'app/views/' + uri;
    }

    // Generates a resolve object by passing script names
    // previously configured in constant.APP_REQUIRES
    function resolveFor() {
      var _args = arguments;
      return {
        deps: ['$ocLazyLoad', '$q', function($ocLL, $q) {
          // Creates a promise chain for each argument
          var promise = $q.when(1); // empty promise
          for (var i = 0, len = _args.length; i < len; i++) {
            promise = andThen(_args[i]);
          }
          return promise;

          // creates promise to chain dynamically
          function andThen(_arg) {
            // also support a function that returns a promise
            if (typeof _arg === 'function')
              return promise.then(_arg);
            else
              return promise.then(function() {
                // if is a module, pass the name. If not, pass the array
                var whatToLoad = getRequired(_arg);
                // simple error check
                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                // finally, return a promise
                return $ocLL.load(whatToLoad);
              });
          }
          // check and returns required data
          // analyze module items with the form [name: '', files: []]
          // and also simple array of script files (for not angular js)
          function getRequired(name) {
            if (APP_REQUIRES.modules)
              for (var m in APP_REQUIRES.modules)
                if (APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                  return APP_REQUIRES.modules[m];
            return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
          }

        }]
      };
    } // resolveFor

  }


})();