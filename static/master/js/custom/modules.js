(function() {
	'use strict';
	angular.module('app.services', []);
	angular.module('app.directives', []);
	angular.module('app.filters',[]);
	angular.module('app.controllers', [
		'app.core',
		'app.routes',
		'app.sidebar',
		'app.translate',
		'app.settings',
		// 'ngMd5'
	]);
})();