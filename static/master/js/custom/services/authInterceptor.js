(function() {
	'use strict';

	angular.module('app.services')

	.factory('AuthInterceptor', AuthInterceptorFn)
	AuthInterceptorFn.$inject = ['$rootScope', '$q', 'AUTH_EVENTS'];
	//错误码拦截
	function AuthInterceptorFn($rootScope, $q, AUTH_EVENTS) {
		return {
			response: function(response) {
				$rootScope.$broadcast({					
					401: AUTH_EVENTS.notAuthenticated,
					410: AUTH_EVENTS.notAuthorized,
					411: AUTH_EVENTS.notAuthenticated,
					419: AUTH_EVENTS.sessionTimeout,
					440: AUTH_EVENTS.sessionTimeout,
					481: AUTH_EVENTS.notBaseadminAuth,
					700: AUTH_EVENTS.systemError
				}[response.status], response);
				return $q.reject(response);
			}
		};
	}
});