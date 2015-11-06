/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Version: 3.0.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function() {
    'use strict';

    angular
        .module('app', [
            'app.core',
            'app.services',
            'app.filters',
            'app.routes',
            'app.colors',
            'app.utils',
            'app.sidebar',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.icons',
            'app.forms',
            'app.controllers'
        ])              
})();